import { DbService, workflowSteps, workflows } from '@app/db';
import { InjectQueue } from '@nestjs/bullmq';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import type { Queue } from 'bullmq';
import { asc, desc, eq } from 'drizzle-orm';
import type { AuthUser } from '../auth/types/auth.types.js';
import type {
  WorkflowDetailRow,
  WorkflowJob,
  WorkflowRow,
  WorkflowRunResponse,
  WorkflowStatus,
  WorkflowSummaryRow,
} from './types/workflow.types.js';
import { ollamaChat } from './utils/ollama.js';
import { WORKFLOW_QUEUE } from './workflow.constants.js';
import { WorkflowEvents } from './workflow.events.js';

const AGENTS = [
  {
    name: 'Planner',
    prompt: (task: string) =>
      `You are a Planner agent. Break this task into 3 concrete steps:\n${task}`,
  },
  {
    name: 'Researcher',
    prompt: (_task: string, plan: string) =>
      `You are a Researcher agent. Given the plan below, list key facts and tools needed:\n${plan}`,
  },
  {
    name: 'Writer',
    prompt: (task: string, research: string) =>
      `You are a Writer agent. Produce a final deliverable for the task using this research:\nTask: ${task}\nResearch: ${research}`,
  },
];

@Injectable()
export class WorkflowService implements OnApplicationBootstrap {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    private readonly db: DbService,
    @InjectQueue(WORKFLOW_QUEUE) private readonly queue: Queue<WorkflowJob>,
    private readonly events: WorkflowEvents,
  ) {}

  async onApplicationBootstrap() {
    await this.db.updateWhere(workflows, eq(workflows.status, 'running'), {
      status: 'failed',
      completedAt: new Date(),
    });
    const queued = await this.db.query.workflows.findMany({
      where: eq(workflows.status, 'queued'),
      orderBy: asc(workflows.id),
    });
    for (const workflow of queued) await this.enqueue(workflow);
  }

  async run(task: string, userId: number): Promise<WorkflowRunResponse> {
    const workflow = await this.db.insert(workflows, {
      task,
      userId,
      status: 'queued',
    });
    const finished = this.events.finished(workflow.id);
    await this.enqueue(workflow);
    await finished;

    const steps = await this.db.query.workflowSteps.findMany({
      where: eq(workflowSteps.workflowId, workflow.id),
    });
    return {
      task,
      workflowId: workflow.id,
      steps: steps.map((s) => ({
        agent: s.agent,
        input: s.input,
        output: s.output,
      })),
    };
  }

  async start(
    task: string,
    userId: number,
  ): Promise<{ workflow: WorkflowSummaryRow }> {
    const workflow = await this.db.insert(workflows, {
      task,
      userId,
      status: 'queued',
    });
    await this.enqueue(workflow);
    return { workflow: { ...workflow, stepCount: 0 } };
  }

  async listForUser(
    userId: number,
  ): Promise<{ workflows: WorkflowSummaryRow[] }> {
    const rows = await this.db.query.workflows.findMany({
      where: eq(workflows.userId, userId),
      orderBy: desc(workflows.createdAt),
      with: { steps: { columns: { id: true } } },
    });
    return {
      workflows: rows.map(({ steps, ...workflow }) => ({
        ...workflow,
        stepCount: steps.length,
      })),
    };
  }

  async get(
    id: number,
    user: AuthUser,
  ): Promise<{ workflow: WorkflowDetailRow }> {
    const workflow = await this.db.query.workflows.findFirst({
      where: eq(workflows.id, id),
      with: { steps: { orderBy: asc(workflowSteps.id) } },
    });
    if (!workflow || (workflow.userId !== user.id && user.role !== 'admin')) {
      throw new NotFoundException('Workflow not found');
    }
    return { workflow };
  }

  async remove(id: number, user: AuthUser) {
    const { workflow } = await this.get(id, user);
    if (workflow.userId !== user.id) {
      throw new NotFoundException('Workflow not found');
    }
    if (workflow.status === 'queued' || workflow.status === 'running') {
      throw new ConflictException('Workflow is still running');
    }
    await this.db.delete(workflows, id);
  }

  async listAll(): Promise<{ workflows: WorkflowDetailRow[] }> {
    const rows = await this.db.query.workflows.findMany({
      with: { steps: true },
    });
    return { workflows: rows };
  }

  async process({ workflowId, task }: WorkflowJob) {
    const workflow = await this.db.findById(workflows, workflowId);
    if (!workflow || workflow.status !== 'queued') return;

    await this.db.update(workflows, workflowId, { status: 'running' });
    this.notify(workflow, 'running', 0);
    try {
      let previous = task;
      for (const [i, agent] of AGENTS.entries()) {
        const output = await ollamaChat(agent.prompt(task, previous));
        await this.db.insert(workflowSteps, {
          workflowId,
          agent: agent.name,
          input: i === 0 ? task : previous.slice(0, 500),
          output,
        });
        previous = output;
        this.notify(workflow, 'running', i + 1);
      }
      await this.finish(workflow, 'completed', AGENTS.length);
    } catch (err) {
      this.logger.error(err);
      await this.finish(workflow, 'failed').catch(() => {});
    }
  }

  private async enqueue(workflow: WorkflowRow) {
    await this.queue.add(
      'run',
      { workflowId: workflow.id, task: workflow.task },
      {
        jobId: `workflow-${workflow.id}`,
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );
    this.notify(workflow, 'queued', 0);
  }

  private async finish(
    workflow: WorkflowRow,
    status: 'completed' | 'failed',
    stepCount?: number,
  ) {
    await this.db.update(workflows, workflow.id, {
      status,
      completedAt: new Date(),
    });
    const steps =
      stepCount ??
      (
        await this.db.query.workflowSteps.findMany({
          where: eq(workflowSteps.workflowId, workflow.id),
          columns: { id: true },
        })
      ).length;
    this.notify(workflow, status, steps);
  }

  private notify(
    workflow: WorkflowRow,
    status: WorkflowStatus,
    stepCount: number,
  ) {
    this.events.emit({
      userId: workflow.userId,
      workflowId: workflow.id,
      status,
      stepCount,
    });
  }
}

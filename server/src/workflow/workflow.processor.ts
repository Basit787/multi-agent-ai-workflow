import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import type { WorkflowJob } from './types/workflow.types.js';
import { WORKFLOW_QUEUE } from './workflow.constants.js';
import { WorkflowService } from './workflow.service.js';

@Processor(WORKFLOW_QUEUE, { concurrency: 1 })
export class WorkflowProcessor extends WorkerHost {
  constructor(private readonly workflowService: WorkflowService) {
    super();
  }

  process(job: Job<WorkflowJob>) {
    return this.workflowService.process(job.data);
  }
}

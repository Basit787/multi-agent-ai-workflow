import type { workflowSteps, workflows } from '../../../libs/db/src/schema.js';
import type { WorkflowStatus } from '../../../libs/db/src/types.js';
import type { Jsonify } from '../../common/types/api.types.js';

export type { WorkflowStatus };

export type WorkflowRow = typeof workflows.$inferSelect;
export type WorkflowStepRow = typeof workflowSteps.$inferSelect;
export type WorkflowSummaryRow = WorkflowRow & { stepCount: number };
export type WorkflowDetailRow = WorkflowRow & { steps: WorkflowStepRow[] };

export type WorkflowSummary = Jsonify<WorkflowSummaryRow>;
export type WorkflowDetail = Jsonify<WorkflowDetailRow>;
export type WorkflowStep = Jsonify<WorkflowStepRow>;

export type WorkflowListResponse = { workflows: WorkflowSummary[] };
export type WorkflowResponse = { workflow: WorkflowDetail };
export type WorkflowCreatedResponse = { workflow: WorkflowSummary };
export type WorkflowRunResponse = {
  task: string;
  workflowId: number;
  steps: Pick<WorkflowStep, 'agent' | 'input' | 'output'>[];
};
export type WorkflowAllResponse = { workflows: WorkflowDetail[] };

export type WorkflowJob = { workflowId: number; task: string };
export type WorkflowEvent = {
  workflowId: number;
  status: WorkflowStatus;
  stepCount: number;
};

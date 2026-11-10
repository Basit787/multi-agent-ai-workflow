import type { WorkflowDetail } from "@server";
import { AppAlert } from "#/components/common/app-alert";
import { AGENTS } from "#/routes/workflows/_lib/agents";

export function FailedAlert({ workflow }: { workflow: WorkflowDetail }) {
  const stoppedAt = AGENTS[workflow.steps.length]?.name ?? "last";
  return (
    <AppAlert
      variant="destructive"
      title="This run failed"
      description={`It stopped at the ${stoppedAt} agent, so there is no final summary. Use “Run again” to retry the same task.`}
    />
  );
}

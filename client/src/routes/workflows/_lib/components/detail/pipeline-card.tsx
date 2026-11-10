import type { WorkflowDetail } from "@server";
import { AppCard } from "#/components/common/app-card";
import { AGENTS } from "#/routes/workflows/_lib/agents";
import { AgentFlow } from "./agent-flow";
import { PipelineAction } from "./pipeline-action";
import { PipelineProgress } from "./pipeline-progress";

function summary(workflow: WorkflowDetail) {
  const current = AGENTS[workflow.steps.length];
  if (workflow.status === "queued") return "Waiting in the queue…";
  if (workflow.status === "completed") return "All agents finished";
  if (workflow.status === "failed")
    return `Failed at the ${current?.name ?? "last"} agent`;
  return `${current?.name} is working…`;
}

export function PipelineCard({
  workflow,
  onViewResults,
}: {
  workflow: WorkflowDetail;
  onViewResults: () => void;
}) {
  return (
    <AppCard
      title="Agent pipeline"
      description={summary(workflow)}
      action={
        <PipelineAction workflow={workflow} onViewResults={onViewResults} />
      }
      contentClassName="space-y-4"
    >
      <PipelineProgress workflow={workflow} />
      <div className="rounded-lg border bg-muted/30">
        <AgentFlow workflow={workflow} />
      </div>
    </AppCard>
  );
}

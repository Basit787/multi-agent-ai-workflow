import type { WorkflowDetail } from "@server";
import { Progress } from "#/components/ui/progress";
import { cn } from "#/lib/utils";
import { AGENTS } from "#/routes/workflows/_lib/agents";

export function PipelineProgress({ workflow }: { workflow: WorkflowDetail }) {
  const done = workflow.steps.length;
  return (
    <div className="flex items-center gap-3">
      <Progress
        value={(done / AGENTS.length) * 100}
        className={cn(
          "h-1.5",
          workflow.status === "failed" && "[&>div]:bg-destructive",
        )}
      />
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {done}/{AGENTS.length}
      </span>
    </div>
  );
}

import type { WorkflowStatus } from "@server";
import { cn } from "#/lib/utils";
import { AGENTS } from "#/routes/workflows/_lib/agents";

export function AgentsProgress({
  stepCount,
  status,
}: {
  stepCount: number;
  status: WorkflowStatus;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {AGENTS.map((agent, i) => (
        <span
          key={agent.name}
          title={agent.name}
          className={cn(
            "h-1.5 w-6 rounded-full bg-foreground/15",
            i < stepCount && "bg-primary",
            status === "failed" && i === stepCount && "bg-destructive",
          )}
        />
      ))}
      <span className="ml-1 text-xs tabular-nums text-muted-foreground">
        {stepCount}/{AGENTS.length}
      </span>
    </div>
  );
}

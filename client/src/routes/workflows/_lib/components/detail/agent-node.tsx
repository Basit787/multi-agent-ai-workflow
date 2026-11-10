import { Handle, type NodeProps, Position } from "@xyflow/react";
import { IconTile } from "#/components/common/icon-tile";
import { Badge } from "#/components/ui/badge";
import { cn } from "#/lib/utils";
import type { AgentNodeType, AgentState } from "#/routes/workflows/_lib/types";
import { AgentStateIcon } from "./agent-state-icon";

const STATE_LABEL: Record<AgentState, string> = {
  pending: "Waiting",
  running: "Working",
  done: "Done",
  failed: "Failed",
};

export function AgentNode({ data }: NodeProps<AgentNodeType>) {
  const { agent, index, state, duration } = data;
  return (
    <div
      className={cn(
        "w-64 rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all",
        state === "running" && "border-primary/60 ring-4 ring-primary/10",
        state === "done" && "border-success/40",
        state === "failed" &&
          "border-destructive/60 ring-4 ring-destructive/10",
        state === "pending" && "opacity-70",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="opacity-0!"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconTile
            icon={agent.icon}
            size="md"
            tone={
              state === "running"
                ? "primary"
                : state === "failed"
                  ? "destructive"
                  : "muted"
            }
          />
          <div>
            <p className="text-xs text-muted-foreground">Agent {index + 1}</p>
            <p className="font-semibold">{agent.name}</p>
          </div>
        </div>
        <AgentStateIcon state={state} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {agent.description}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <Badge
          variant={state === "running" ? "default" : "outline"}
          className={cn(
            state === "done" && "border-success/30 text-success",
            state === "failed" && "border-destructive/30 text-destructive",
          )}
        >
          {STATE_LABEL[state]}
        </Badge>
        {duration && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {duration}
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="opacity-0!"
      />
    </div>
  );
}

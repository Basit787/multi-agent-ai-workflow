import { CircleCheck, CircleDashed, CircleX, LoaderCircle } from "lucide-react";
import type { AgentState } from "#/routes/workflows/_lib/types";

export function AgentStateIcon({ state }: { state: AgentState }) {
  if (state === "running")
    return <LoaderCircle className="size-4 animate-spin text-primary" />;
  if (state === "done") return <CircleCheck className="size-4 text-success" />;
  if (state === "failed")
    return <CircleX className="size-4 text-destructive" />;
  return <CircleDashed className="size-4 text-muted-foreground" />;
}

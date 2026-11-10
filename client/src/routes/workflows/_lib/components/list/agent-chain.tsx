import { Fragment } from "react";
import { Badge } from "#/components/ui/badge";
import { AGENTS } from "#/routes/workflows/_lib/agents";

export function AgentChain() {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      {AGENTS.map((agent, i) => (
        <Fragment key={agent.name}>
          {i > 0 && <span aria-hidden>→</span>}
          <Badge variant="outline" className="gap-1">
            <agent.icon />
            {agent.name}
          </Badge>
        </Fragment>
      ))}
    </div>
  );
}

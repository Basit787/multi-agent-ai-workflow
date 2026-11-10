import { IconTile } from "#/components/common/icon-tile";
import { Brand } from "#/components/layout/brand";
import { AGENTS } from "#/routes/workflows/_lib/agents";

export function AuthHero() {
  return (
    <aside className="hidden flex-col border-r bg-muted/40 p-10 lg:flex">
      <Brand />
      <div className="my-auto max-w-md space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">
            Three agents. One answer.
          </h2>
          <p className="text-muted-foreground">
            Describe a task and a Planner, Researcher and Writer work through it
            in sequence on a local LLM. Every step is saved.
          </p>
        </div>
        <ul className="space-y-5">
          {AGENTS.map((agent) => (
            <li key={agent.name} className="flex items-start gap-3">
              <IconTile icon={agent.icon} tone="outline" />
              <div>
                <p className="text-sm font-medium">{agent.name}</p>
                <p className="text-sm text-muted-foreground">
                  {agent.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

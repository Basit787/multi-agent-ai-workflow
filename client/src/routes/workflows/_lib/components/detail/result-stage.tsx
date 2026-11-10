import type { WorkflowStep } from "@server";
import { ChevronRight } from "lucide-react";
import { IconTile } from "#/components/common/icon-tile";
import { Markdown } from "#/components/markdown";
import { Button } from "#/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible";
import type { Agent } from "#/routes/workflows/_lib/types";

export function ResultStage({
  agent,
  step,
}: {
  agent: Agent;
  step: WorkflowStep | undefined;
}) {
  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center gap-3">
        <IconTile icon={agent.icon} />
        <div>
          <p className="font-semibold">
            {agent.name} · {agent.resultTitle}
          </p>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </div>
      </div>
      {step ? (
        <>
          <Collapsible className="rounded-lg border bg-muted/40">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="group w-full justify-start text-muted-foreground"
              >
                <ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />
                Input given to the {agent.name}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-3 text-sm whitespace-pre-wrap text-muted-foreground">
              {step.input}
            </CollapsibleContent>
          </Collapsible>
          <Markdown>{step.output}</Markdown>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          This agent did not produce output.
        </p>
      )}
    </div>
  );
}

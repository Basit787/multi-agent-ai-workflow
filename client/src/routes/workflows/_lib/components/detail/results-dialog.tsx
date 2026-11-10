import type { WorkflowDetail } from "@server";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { ScrollArea } from "#/components/ui/scroll-area";
import { useCopy } from "#/hooks/use-copy";
import { AGENTS } from "#/routes/workflows/_lib/agents";
import { ResultStage } from "./result-stage";
import { ResultsStepper } from "./results-stepper";
import { WorkflowDownloadMenu } from "./workflow-download-menu";

export function ResultsDialog({
  workflow,
  open,
  onOpenChange,
}: {
  workflow: WorkflowDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [stage, setStage] = useState(0);
  const copy = useCopy();
  const last = AGENTS.length - 1;
  const agent = AGENTS[stage];
  const step = workflow.steps.find((s) => s.agent === agent.name);

  useEffect(() => {
    if (open) setStage(0);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-3xl">
        <DialogHeader className="space-y-4 border-b p-6">
          <div className="space-y-1.5">
            <DialogTitle>Workflow results</DialogTitle>
            <DialogDescription className="line-clamp-2">
              {workflow.task}
            </DialogDescription>
          </div>
          <ResultsStepper current={stage} onSelect={setStage} />
        </DialogHeader>

        <ScrollArea className="h-[55vh]">
          <ResultStage agent={agent} step={step} />
        </ScrollArea>

        <DialogFooter className="items-center border-t p-4 sm:justify-between">
          <div className="flex items-center gap-3">
            <WorkflowDownloadMenu workflow={workflow} variant="ghost" />
            <span className="hidden text-sm text-muted-foreground md:inline">
              Stage {stage + 1} of {AGENTS.length}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={!step}
              onClick={() => step && copy(step.output, agent.resultTitle)}
            >
              <Copy />
              Copy
            </Button>
            <Button
              variant="outline"
              onClick={() => setStage((s) => s - 1)}
              disabled={stage === 0}
            >
              <ChevronLeft />
              Back
            </Button>
            {stage < last ? (
              <Button onClick={() => setStage((s) => s + 1)}>
                Next
                <ChevronRight />
              </Button>
            ) : (
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

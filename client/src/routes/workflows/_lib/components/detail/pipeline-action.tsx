import type { WorkflowDetail } from "@server";
import { LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { useCreateWorkflow } from "../../api/hook";
import { WorkflowDownloadMenu } from "./workflow-download-menu";

export function PipelineAction({
  workflow,
  onViewResults,
}: {
  workflow: WorkflowDetail;
  onViewResults: () => void;
}) {
  const rerun = useCreateWorkflow();

  if (workflow.status === "failed") {
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <WorkflowDownloadMenu workflow={workflow} />
        <Button
          variant="outline"
          disabled={rerun.isPending}
          onClick={() => rerun.mutate(workflow.task)}
        >
          {rerun.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <RotateCcw />
          )}
          Run again
        </Button>
      </div>
    );
  }

  if (workflow.status === "queued" || workflow.status === "running") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Button disabled>
              <Sparkles />
              View results
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>Available once all three agents finish</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <WorkflowDownloadMenu workflow={workflow} />
      <Button onClick={onViewResults}>
        <Sparkles />
        View results
      </Button>
    </div>
  );
}

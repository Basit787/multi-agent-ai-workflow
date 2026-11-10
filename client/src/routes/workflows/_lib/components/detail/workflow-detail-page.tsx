import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { AppAlert } from "#/components/common/app-alert";
import { PageHeader } from "#/components/common/page-header";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { formatDateTime, formatDuration } from "#/lib/format";
import { WorkflowStatusBadge } from "#/routes/workflows/_lib/components/workflow-status-badge";
import { useWorkflow } from "../../api/hook";
import { FailedAlert } from "./failed-alert";
import { PipelineCard } from "./pipeline-card";
import { ResultsDialog } from "./results-dialog";

export function WorkflowDetailPage({ workflowId }: { workflowId: number }) {
  const { data: workflow, error } = useWorkflow(workflowId);
  const [resultsOpen, setResultsOpen] = useState(false);
  const openResults = () => setResultsOpen(true);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-3">
        <Link to="/workflows">
          <ArrowLeft />
          All workflows
        </Link>
      </Button>

      {error ? (
        <AppAlert
          variant="destructive"
          title="Couldn't load this workflow"
          description={error.message}
        />
      ) : !workflow ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <>
          <PageHeader
            title={`Workflow #${workflow.id}`}
            badge={<WorkflowStatusBadge status={workflow.status} />}
            description={workflow.task}
            meta={`Started ${formatDateTime(workflow.createdAt)}${
              workflow.completedAt
                ? ` · took ${formatDuration(workflow.createdAt, workflow.completedAt)}`
                : ""
            }`}
          />
          {workflow.status === "failed" && <FailedAlert workflow={workflow} />}
          <PipelineCard workflow={workflow} onViewResults={openResults} />
          <ResultsDialog
            workflow={workflow}
            open={resultsOpen}
            onOpenChange={setResultsOpen}
          />
        </>
      )}
    </div>
  );
}

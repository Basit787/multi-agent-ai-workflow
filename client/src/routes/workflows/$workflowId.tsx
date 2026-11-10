import { createFileRoute } from "@tanstack/react-router";
import { WorkflowDetailPage } from "./_lib/components/detail/workflow-detail-page";

export const Route = createFileRoute("/workflows/$workflowId")({
  component: WorkflowDetailRoute,
});

function WorkflowDetailRoute() {
  const { workflowId } = Route.useParams();
  return <WorkflowDetailPage workflowId={Number(workflowId)} />;
}

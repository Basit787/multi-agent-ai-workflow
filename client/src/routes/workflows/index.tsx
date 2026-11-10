import { createFileRoute } from "@tanstack/react-router";
import { WorkflowsPage } from "./_lib/components/list/workflows-page";

export const Route = createFileRoute("/workflows/")({
  component: WorkflowsPage,
});

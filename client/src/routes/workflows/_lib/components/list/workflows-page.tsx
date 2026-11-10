import type { WorkflowSummary } from "@server";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Workflow } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "#/components/common/empty-state";
import { PageHeader } from "#/components/common/page-header";
import { DataTable } from "#/components/data-table/data-table";
import { Button } from "#/components/ui/button";
import { useCopy } from "#/hooks/use-copy";
import { downloadJson } from "#/lib/download";
import { useCreateWorkflow, useWorkflows } from "../../api/hook";
import { CreateWorkflowDialog } from "./create-workflow-dialog";
import { DeleteWorkflowsDialog } from "./delete-workflows-dialog";
import {
  getBulkActions,
  getRowActions,
  getToolbarActions,
} from "./workflow-actions";
import { workflowColumns } from "./workflow-columns";

export function WorkflowsPage() {
  const navigate = useNavigate();
  const copy = useCopy();
  const workflows = useWorkflows();
  const rerun = useCreateWorkflow();
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState<WorkflowSummary[]>([]);

  const open = (w: WorkflowSummary) =>
    navigate({
      to: "/workflows/$workflowId",
      params: { workflowId: String(w.id) },
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows"
        description="Every task you have run through the Planner, Researcher and Writer."
      />

      <DataTable
        data={workflows.data ?? []}
        isLoading={workflows.isPending}
        getRowId={(w) => String(w.id)}
        columns={workflowColumns}
        rowActions={getRowActions({
          onOpen: open,
          onRerun: (w) => rerun.mutate(w.task),
          onCopy: (w) => copy(w.task, "Task"),
          onDelete: setToDelete,
          isRerunning: rerun.isPending,
        })}
        bulkActions={getBulkActions({
          onExport: (rows) => downloadJson(rows, "workflows.json"),
          onDelete: setToDelete,
        })}
        toolbarActions={getToolbarActions({
          onRefresh: () => workflows.refetch(),
          onCreate: () => setCreateOpen(true),
          isRefreshing: workflows.isFetching,
        })}
        onRowClick={open}
        searchPlaceholder="Search tasks or status…"
        emptyState={
          <EmptyState
            icon={Workflow}
            title="No workflows yet"
            description="Start one and watch the agents work through it."
            action={
              <Button onClick={() => setCreateOpen(true)}>
                <Plus />
                New workflow
              </Button>
            }
          />
        }
      />

      <CreateWorkflowDialog open={createOpen} onOpenChange={setCreateOpen} />
      <DeleteWorkflowsDialog
        workflows={toDelete}
        onClose={() => setToDelete([])}
      />
    </div>
  );
}

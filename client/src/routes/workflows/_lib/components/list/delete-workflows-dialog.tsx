import type { WorkflowSummary } from "@server";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "#/components/common/confirm-dialog";
import { useDeleteWorkflows } from "../../api/hook";

export function DeleteWorkflowsDialog({
  workflows,
  onClose,
}: {
  workflows: WorkflowSummary[];
  onClose: () => void;
}) {
  const remove = useDeleteWorkflows();
  const many = workflows.length > 1;

  return (
    <ConfirmDialog
      open={workflows.length > 0}
      onOpenChange={(open) => !open && onClose()}
      title={
        many ? `Delete ${workflows.length} workflows?` : "Delete this workflow?"
      }
      description="The task and every agent's output are removed. This can't be undone."
      confirmLabel="Delete"
      icon={Trash2}
      variant="destructive"
      loading={remove.isPending}
      onConfirm={() => remove.mutate(workflows, { onSettled: onClose })}
    />
  );
}

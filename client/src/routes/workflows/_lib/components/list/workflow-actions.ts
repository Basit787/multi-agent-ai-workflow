import type { WorkflowSummary } from "@server";
import {
  ArrowUpRight,
  Copy,
  Download,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { DataTableAction } from "#/components/data-table/types";

const isRunning = (rows: WorkflowSummary[]) =>
  rows.some((w) => w.status === "queued" || w.status === "running");

export function getRowActions(handlers: {
  onOpen: (w: WorkflowSummary) => void;
  onRerun: (w: WorkflowSummary) => void;
  onCopy: (w: WorkflowSummary) => void;
  onDelete: (rows: WorkflowSummary[]) => void;
  isRerunning: boolean;
}): DataTableAction<WorkflowSummary>[] {
  return [
    {
      id: "open",
      label: "Open",
      icon: ArrowUpRight,
      tooltip: "Open the run",
      onClick: ([w]) => handlers.onOpen(w),
    },
    {
      id: "rerun",
      label: "Run again",
      icon: RotateCcw,
      tooltip: (rows) =>
        isRunning(rows)
          ? "Wait for this run to finish"
          : "Run the same task again",
      disabled: (rows) => isRunning(rows) || handlers.isRerunning,
      onClick: ([w]) => handlers.onRerun(w),
    },
    {
      id: "copy",
      label: "Copy task",
      icon: Copy,
      tooltip: "Copy the task text",
      onClick: ([w]) => handlers.onCopy(w),
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      tooltip: (rows) =>
        isRunning(rows)
          ? "A queued or running workflow can't be deleted"
          : "Delete",
      disabled: isRunning,
      onClick: handlers.onDelete,
    },
  ];
}

export function getBulkActions(handlers: {
  onExport: (rows: WorkflowSummary[]) => void;
  onDelete: (rows: WorkflowSummary[]) => void;
}): DataTableAction<WorkflowSummary>[] {
  return [
    {
      id: "export",
      label: "Export",
      icon: Download,
      tooltip: "Download the selected runs as JSON",
      onClick: handlers.onExport,
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      tooltip: (rows) =>
        isRunning(rows)
          ? "Deselect queued or running workflows to delete"
          : "Delete the selected runs",
      disabled: isRunning,
      onClick: handlers.onDelete,
    },
  ];
}

export function getToolbarActions(handlers: {
  onRefresh: () => void;
  onCreate: () => void;
  isRefreshing: boolean;
}): DataTableAction<WorkflowSummary>[] {
  return [
    {
      id: "refresh",
      label: "Refresh",
      icon: RefreshCw,
      tooltip: "Reload the list",
      disabled: handlers.isRefreshing,
      onClick: handlers.onRefresh,
    },
    {
      id: "create",
      label: "New workflow",
      icon: Plus,
      variant: "default",
      tooltip: "Start a Planner → Researcher → Writer run",
      onClick: handlers.onCreate,
    },
  ];
}

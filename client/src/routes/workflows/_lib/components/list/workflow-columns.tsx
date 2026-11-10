import type { WorkflowSummary } from "@server";
import type { DataTableColumn } from "#/components/data-table/types";
import { formatDateTime, formatDuration } from "#/lib/format";
import { WorkflowStatusBadge } from "#/routes/workflows/_lib/components/workflow-status-badge";
import { AgentsProgress } from "./agents-progress";

export const workflowColumns: DataTableColumn<WorkflowSummary>[] = [
  {
    id: "task",
    header: "Task",
    accessor: (w) => w.task,
    sortable: true,
    searchable: true,
    cell: (w) => (
      <span className="line-clamp-1 max-w-xs font-medium sm:max-w-md">
        {w.task}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessor: (w) => w.status,
    sortable: true,
    searchable: true,
    cell: (w) => <WorkflowStatusBadge status={w.status} />,
  },
  {
    id: "agents",
    header: "Agents",
    accessor: (w) => w.stepCount,
    className: "hidden md:table-cell",
    cell: (w) => <AgentsProgress stepCount={w.stepCount} status={w.status} />,
  },
  {
    id: "createdAt",
    header: "Created",
    accessor: (w) => Date.parse(w.createdAt),
    sortable: true,
    className: "hidden sm:table-cell",
    cell: (w) => (
      <span className="text-muted-foreground">
        {formatDateTime(w.createdAt)}
      </span>
    ),
  },
  {
    id: "duration",
    header: "Duration",
    className: "hidden lg:table-cell",
    cell: (w) => (
      <span className="tabular-nums text-muted-foreground">
        {formatDuration(w.createdAt, w.completedAt)}
      </span>
    ),
  },
];

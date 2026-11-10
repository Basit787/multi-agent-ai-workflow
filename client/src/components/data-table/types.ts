import type { RowData } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { features } from "#/components/data-table/table-features";

export type DataTableColumn<T extends RowData> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  accessor?: (row: T) => string | number;
  sortable?: boolean;
  searchable?: boolean;
  className?: string;
};

export type DataTableAction<T extends RowData> = {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: (rows: T[]) => void;
  tooltip?: string | ((rows: T[]) => string);
  disabled?: boolean | ((rows: T[]) => boolean);
  variant?: "default" | "outline" | "ghost" | "destructive";
};

export type DataTableProps<T extends RowData> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  rowActions?: DataTableAction<T>[];
  bulkActions?: DataTableAction<T>[];
  toolbarActions?: DataTableAction<T>[];
  onRowClick?: (row: T) => void;
  searchPlaceholder?: string;
  isLoading?: boolean;
  emptyState?: ReactNode;
  pageSize?: number;
};

export type ColumnMeta = { className?: string };

export type Features = typeof features;

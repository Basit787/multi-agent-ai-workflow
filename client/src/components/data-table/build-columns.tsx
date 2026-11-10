import {
  type ColumnDef,
  type RowData,
  sortFn_basic,
} from "@tanstack/react-table";
import { ActionButton } from "#/components/data-table/action-button";
import type {
  DataTableAction,
  DataTableColumn,
  Features,
} from "#/components/data-table/types";
import { Checkbox } from "#/components/ui/checkbox";

export function buildColumns<T extends RowData>({
  columns,
  rowActions,
  selectable,
}: {
  columns: DataTableColumn<T>[];
  rowActions: DataTableAction<T>[];
  selectable: boolean;
}) {
  const defs: ColumnDef<Features, T>[] = columns.map((column) => ({
    id: column.id,
    header: column.header,
    accessorFn: column.accessor ?? (() => ""),
    cell: ({ row }) => column.cell(row.original),
    enableSorting: !!column.sortable,
    sortFn: sortFn_basic,
    enableGlobalFilter: !!column.searchable,
    meta: { className: column.className },
  }));

  if (selectable) {
    defs.unshift({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { className: "w-10" },
    });
  }

  if (rowActions.length > 0) {
    defs.push({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div data-row-actions className="flex justify-end gap-0.5">
          {rowActions.map((action) => (
            <ActionButton
              key={action.id}
              action={action}
              rows={[row.original]}
              iconOnly
            />
          ))}
        </div>
      ),
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { className: "w-px text-right" },
    });
  }

  return defs;
}

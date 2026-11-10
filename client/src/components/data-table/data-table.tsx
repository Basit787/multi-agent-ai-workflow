import {
  filterFn_includesString,
  flexRender,
  type RowData,
  useTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { buildColumns } from "#/components/data-table/build-columns";
import { DataTablePagination } from "#/components/data-table/data-table-pagination";
import { DataTableToolbar } from "#/components/data-table/data-table-toolbar";
import { SortButton } from "#/components/data-table/sort-button";
import { features } from "#/components/data-table/table-features";
import type {
  ColumnMeta,
  DataTableProps,
  Features,
} from "#/components/data-table/types";
import { Skeleton } from "#/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { cn } from "#/lib/utils";

export function DataTable<T extends RowData>({
  data,
  columns,
  getRowId,
  rowActions = [],
  bulkActions = [],
  toolbarActions = [],
  onRowClick,
  searchPlaceholder = "Search…",
  isLoading,
  emptyState,
  pageSize = 10,
}: DataTableProps<T>) {
  const tableColumns = useMemo(
    () =>
      buildColumns({ columns, rowActions, selectable: bulkActions.length > 0 }),
    [columns, rowActions, bulkActions.length],
  );

  const table = useTable<Features, T>(
    {
      features,
      columns: tableColumns,
      data,
      getRowId,
      globalFilterFn: filterFn_includesString,
      initialState: { pagination: { pageIndex: 0, pageSize } },
    },
    (state) => state,
  );

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const rowCount = table.getFilteredRowModel().rows.length;
  const search = (table.state.globalFilter as string | undefined) ?? "";
  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      <DataTableToolbar
        selectedRows={selectedRows}
        bulkActions={bulkActions}
        toolbarActions={toolbarActions}
        search={search}
        onSearchChange={(value) => table.setGlobalFilter(value)}
        searchPlaceholder={searchPlaceholder}
        onClearSelection={() => table.resetRowSelection()}
      />

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const label = header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      );
                  return (
                    <TableHead
                      key={header.id}
                      className={metaClass(header.column.columnDef.meta)}
                    >
                      {header.column.getCanSort() ? (
                        <SortButton
                          sorted={header.column.getIsSorted()}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {label}
                        </SortButton>
                      ) : (
                        label
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                <TableRow key={i}>
                  <TableCell colSpan={tableColumns.length}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={tableColumns.length} className="h-48 p-0">
                  {search ? (
                    <p className="text-center text-sm text-muted-foreground">
                      No results for “{search}”.
                    </p>
                  ) : (
                    emptyState
                  )}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={
                    onRowClick
                      ? (e) => {
                          const target = e.target as HTMLElement;
                          if (!target.closest("[data-row-actions]")) {
                            onRowClick(row.original);
                          }
                        }
                      : undefined
                  }
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={metaClass(cell.column.columnDef.meta)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && rowCount > 0 && (
        <DataTablePagination
          selectedCount={bulkActions.length > 0 ? selectedRows.length : 0}
          rowCount={rowCount}
          pageIndex={table.state.pagination.pageIndex}
          pageCount={table.getPageCount()}
          pageSize={table.state.pagination.pageSize}
          canPrevious={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
          onPageChange={(index) => table.setPageIndex(index)}
          onPageSizeChange={(size) => table.setPageSize(size)}
        />
      )}
    </div>
  );
}

function metaClass(meta: unknown) {
  return (meta as ColumnMeta | undefined)?.className;
}

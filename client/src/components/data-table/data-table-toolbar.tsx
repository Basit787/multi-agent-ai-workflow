import type { RowData } from "@tanstack/react-table";
import { SearchIcon, X } from "lucide-react";
import { ActionButton } from "#/components/data-table/action-button";
import type { DataTableAction } from "#/components/data-table/types";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

export function DataTableToolbar<T extends RowData>({
  selectedRows,
  bulkActions,
  toolbarActions,
  search,
  onSearchChange,
  searchPlaceholder,
  onClearSelection,
}: {
  selectedRows: T[];
  bulkActions: DataTableAction<T>[];
  toolbarActions: DataTableAction<T>[];
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  onClearSelection: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {selectedRows.length > 0 ? (
        <div className="flex h-9 items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Clear selection"
            onClick={onClearSelection}
          >
            <X />
          </Button>
          <span className="text-sm font-medium">
            {selectedRows.length} selected
          </span>
          <div className="ml-2 flex items-center gap-2">
            {bulkActions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                rows={selectedRows}
                size="sm"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        {toolbarActions.map((action) => (
          <ActionButton key={action.id} action={action} rows={[]} />
        ))}
      </div>
    </div>
  );
}

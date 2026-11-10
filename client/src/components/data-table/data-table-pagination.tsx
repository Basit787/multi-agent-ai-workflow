import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";

export const PAGE_SIZES = [5, 10, 20, 50];

export function DataTablePagination({
  selectedCount,
  rowCount,
  pageIndex,
  pageCount,
  pageSize,
  canPrevious,
  canNext,
  onPageChange,
  onPageSizeChange,
}: {
  selectedCount: number;
  rowCount: number;
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  canPrevious: boolean;
  canNext: boolean;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const lastPage = Math.max(pageCount, 1) - 1;
  const buttons = [
    { label: "First page", icon: ChevronsLeft, page: 0, enabled: canPrevious },
    {
      label: "Previous page",
      icon: ChevronLeft,
      page: pageIndex - 1,
      enabled: canPrevious,
    },
    {
      label: "Next page",
      icon: ChevronRight,
      page: pageIndex + 1,
      enabled: canNext,
    },
    {
      label: "Last page",
      icon: ChevronsRight,
      page: lastPage,
      enabled: canNext,
    },
  ];

  return (
    <div className="flex flex-col-reverse gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        {selectedCount > 0
          ? `${selectedCount} of ${rowCount} selected`
          : `${rowCount} ${rowCount === 1 ? "row" : "rows"}`}
      </span>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger size="sm" className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="tabular-nums">
          Page {pageIndex + 1} of {lastPage + 1}
        </span>
        <div className="flex items-center gap-1">
          {buttons.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              size="icon-sm"
              aria-label={item.label}
              disabled={!item.enabled}
              onClick={() => onPageChange(item.page)}
            >
              <item.icon />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

import type { RowData } from "@tanstack/react-table";
import type { DataTableAction } from "#/components/data-table/types";
import { Button } from "#/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

export function ActionButton<T extends RowData>({
  action,
  rows,
  iconOnly,
  size = "default",
}: {
  action: DataTableAction<T>;
  rows: T[];
  iconOnly?: boolean;
  size?: "default" | "sm";
}) {
  const disabled =
    typeof action.disabled === "function"
      ? action.disabled(rows)
      : !!action.disabled;
  const tooltip =
    typeof action.tooltip === "function"
      ? action.tooltip(rows)
      : action.tooltip;
  const destructive = action.variant === "destructive";

  const button = (
    <Button
      type="button"
      variant={
        iconOnly
          ? "ghost"
          : destructive
            ? "outline"
            : (action.variant ?? "outline")
      }
      size={iconOnly ? "icon-sm" : size}
      disabled={disabled}
      aria-label={action.label}
      className={cn(
        destructive &&
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
      )}
      onClick={(e) => {
        e.stopPropagation();
        action.onClick(rows);
      }}
    >
      <action.icon />
      {!iconOnly && action.label}
    </Button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={disabled ? 0 : undefined}>
          {button}
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

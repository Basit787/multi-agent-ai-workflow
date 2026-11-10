import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export function SortButton({
  sorted,
  onClick,
  children,
}: {
  sorted: false | "asc" | "desc";
  onClick?: (event: unknown) => void;
  children: ReactNode;
}) {
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <Button variant="ghost" size="sm" className="-ml-2.5" onClick={onClick}>
      {children}
      <Icon className={cn("size-3.5", !sorted && "text-muted-foreground/60")} />
    </Button>
  );
}

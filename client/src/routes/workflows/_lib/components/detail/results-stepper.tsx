import { Check } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";
import { AGENTS } from "#/routes/workflows/_lib/agents";

export function ResultsStepper({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (stage: number) => void;
}) {
  return (
    <ol className="flex items-center gap-2">
      {AGENTS.map((agent, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={agent.name}
            className="flex flex-1 items-center gap-2 last:flex-none"
          >
            <Button
              variant="ghost"
              size="sm"
              aria-current={active ? "step" : undefined}
              className={cn(
                "px-1.5",
                active ? "font-medium" : "font-normal text-muted-foreground",
              )}
              onClick={() => onSelect(i)}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                  active && "border-primary bg-primary text-primary-foreground",
                  done && "border-primary text-primary",
                )}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{agent.resultTitle}</span>
            </Button>
            {i < AGENTS.length - 1 && (
              <Separator className={cn("flex-1", done && "bg-primary")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

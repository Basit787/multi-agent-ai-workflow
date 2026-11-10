import { Workflow } from "lucide-react";

export function Brand() {
  return (
    <div className="flex items-center gap-2 font-semibold">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Workflow className="size-4" />
      </span>
      Multi-Agent Workflow
    </div>
  );
}

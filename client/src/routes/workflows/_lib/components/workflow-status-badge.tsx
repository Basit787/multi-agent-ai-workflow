import type { WorkflowStatus } from "@server";
import { CircleCheck, CircleX, Clock, LoaderCircle } from "lucide-react";
import { Badge } from "#/components/ui/badge";

export function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  if (status === "queued") {
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        <Clock />
        Queued
      </Badge>
    );
  }
  if (status === "running") {
    return (
      <Badge variant="outline" className="gap-1">
        <LoaderCircle className="animate-spin" />
        Running
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-destructive/30 text-destructive"
      >
        <CircleX />
        Failed
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 border-success/30 text-success">
      <CircleCheck />
      Generated
    </Badge>
  );
}

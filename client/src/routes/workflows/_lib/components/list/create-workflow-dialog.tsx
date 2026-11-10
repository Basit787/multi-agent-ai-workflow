import { useForm } from "@tanstack/react-form";
import { LoaderCircle, Sparkles } from "lucide-react";
import { z } from "zod";
import { FieldError } from "#/components/field-error";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { useCreateWorkflow } from "../../api/hook";
import { AgentChain } from "./agent-chain";
import { TaskExamples } from "./task-examples";

const taskSchema = z.object({
  task: z
    .string()
    .trim()
    .min(3, "Describe your task")
    .max(4000, "Keep it under 4000 characters"),
});

export function CreateWorkflowDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateWorkflow();

  const form = useForm({
    defaultValues: { task: "" },
    validators: { onSubmit: taskSchema },
    onSubmit: ({ value }) =>
      create
        .mutateAsync(value.task.trim())
        .then(() => {
          onOpenChange(false);
          form.reset();
        })
        .catch(() => {}),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New multi-agent workflow</DialogTitle>
          <DialogDescription>
            Describe the task. Three agents work through it one after another.
          </DialogDescription>
        </DialogHeader>

        <AgentChain />

        <form
          id="create-workflow"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="task">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="new-task">Task</Label>
                <Textarea
                  id="new-task"
                  rows={5}
                  autoFocus
                  className="max-h-60 resize-none"
                  placeholder="e.g. Plan a three-day trip to Lisbon on a mid-range budget"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      form.handleSubmit();
                    }
                  }}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError errors={field.state.meta.errors} />
                <TaskExamples onPick={field.handleChange} />
              </div>
            )}
          </form.Field>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-workflow"
            disabled={create.isPending}
          >
            {create.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            Start workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import type { WorkflowSummary } from "@server";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { debounceTime, filter, Subscription } from "rxjs";
import { useToast } from "#/hooks/use-toast";
import { queryClient } from "#/lib/query-client";
import {
  createWorkflow,
  deleteWorkflow,
  getWorkflow,
  getWorkflows,
  workflowEvents$,
} from "./api";

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: getWorkflows,
  });
}

export function useWorkflow(id: number) {
  return useQuery({
    queryKey: ["workflows", id],
    queryFn: () => getWorkflow(id),
    retry: false,
  });
}

export function useCreateWorkflow() {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: (workflow) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      showSuccessToast("Workflow queued", {
        description: "It starts as soon as the agents are free.",
      });
      navigate({
        to: "/workflows/$workflowId",
        params: { workflowId: String(workflow.id) },
      });
    },
    onError: (error) => showErrorToast(error),
  });
}

export function useDeleteWorkflows() {
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (rows: WorkflowSummary[]) =>
      Promise.all(rows.map((w) => deleteWorkflow(w.id))),
    onSuccess: (_, rows) =>
      showSuccessToast(
        rows.length === 1
          ? "Workflow deleted"
          : `${rows.length} workflows deleted`,
      ),
    onError: (error) => showErrorToast(error),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["workflows"] }),
  });
}

export function useWorkflowEvents(enabled: boolean) {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    if (!enabled) return;
    const subscription = new Subscription();

    subscription.add(
      workflowEvents$
        .pipe(debounceTime(150))
        .subscribe(() =>
          queryClient.invalidateQueries({ queryKey: ["workflows"] }),
        ),
    );

    subscription.add(
      workflowEvents$
        .pipe(
          filter(
            (event) =>
              event.status === "completed" || event.status === "failed",
          ),
        )
        .subscribe((event) => {
          const view = {
            label: "View",
            onClick: () =>
              navigate({
                to: "/workflows/$workflowId",
                params: { workflowId: String(event.workflowId) },
              }),
          };
          if (event.status === "completed") {
            showSuccessToast("Workflow generated", {
              description: `Workflow #${event.workflowId}: all three agents have finished.`,
              action: view,
            });
          } else {
            showErrorToast(new Error("Workflow failed"), {
              description: `Workflow #${event.workflowId} stopped before finishing.`,
              action: view,
            });
          }
        }),
    );

    return () => subscription.unsubscribe();
  }, [enabled, navigate, showSuccessToast, showErrorToast]);
}

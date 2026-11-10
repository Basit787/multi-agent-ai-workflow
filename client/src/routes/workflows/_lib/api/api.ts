import type {
  WorkflowCreatedResponse,
  WorkflowDetail,
  WorkflowEvent,
  WorkflowListResponse,
  WorkflowResponse,
  WorkflowSummary,
} from "@server";
import { Observable, share } from "rxjs";
import { http } from "#/lib/axios";
import { toApiError } from "#/lib/parser";

export async function getWorkflows(): Promise<WorkflowSummary[]> {
  try {
    const data = await http.get<WorkflowListResponse>("/workflows");
    return data.workflows;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getWorkflow(id: number): Promise<WorkflowDetail> {
  try {
    const data = await http.get<WorkflowResponse>(`/workflows/${id}`);
    return data.workflow;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createWorkflow(task: string): Promise<WorkflowSummary> {
  try {
    const data = await http.post<WorkflowCreatedResponse>("/workflows", {
      task,
    });
    return data.workflow;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteWorkflow(id: number): Promise<void> {
  try {
    await http.delete(`/workflows/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}

export const workflowEvents$ = new Observable<WorkflowEvent>((subscriber) => {
  const source = new EventSource("/api/workflows/events", {
    withCredentials: true,
  });
  source.addEventListener("workflow", (message: MessageEvent<string>) =>
    subscriber.next(JSON.parse(message.data) as WorkflowEvent),
  );
  return () => source.close();
}).pipe(share());

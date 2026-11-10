import type { WorkflowDetail } from "@server";
import { ListChecks, PenLine, Search } from "lucide-react";
import type { Agent, AgentState } from "#/routes/workflows/_lib/types";

export const AGENTS: Agent[] = [
  {
    name: "Planner",
    icon: ListChecks,
    description: "Breaks the task into concrete steps",
    resultTitle: "Plan",
  },
  {
    name: "Researcher",
    icon: Search,
    description: "Gathers the key facts and tools",
    resultTitle: "Research",
  },
  {
    name: "Writer",
    icon: PenLine,
    description: "Produces the final deliverable",
    resultTitle: "Final summary",
  },
];

export function agentStates(workflow: WorkflowDetail): AgentState[] {
  const finished = workflow.steps.length;
  return AGENTS.map((_, i) => {
    if (i < finished) return "done";
    if (i > finished) return "pending";
    if (workflow.status === "running") return "running";
    return workflow.status === "failed" ? "failed" : "pending";
  });
}

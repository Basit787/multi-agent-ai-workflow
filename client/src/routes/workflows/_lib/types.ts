import type { Node } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";

export type Agent = {
  name: string;
  icon: LucideIcon;
  description: string;
  resultTitle: string;
};

export type AgentState = "pending" | "running" | "done" | "failed";

export type AgentNodeData = {
  agent: Agent;
  index: number;
  state: AgentState;
  duration?: string;
};
export type AgentNodeType = Node<AgentNodeData, "agent">;

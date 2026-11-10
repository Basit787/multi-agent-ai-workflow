import "@xyflow/react/dist/style.css";
import type { WorkflowDetail } from "@server";
import {
  Background,
  BackgroundVariant,
  type Edge,
  ReactFlow,
} from "@xyflow/react";
import { useMemo } from "react";
import { formatDuration } from "#/lib/format";
import { cn } from "#/lib/utils";
import { AGENTS, agentStates } from "#/routes/workflows/_lib/agents";
import type { AgentNodeType } from "#/routes/workflows/_lib/types";
import { AgentNode } from "./agent-node";

const nodeTypes = { agent: AgentNode };

export function AgentFlow({ workflow }: { workflow: WorkflowDetail }) {
  const { nodes, edges } = useMemo(() => {
    const states = agentStates(workflow);

    const nodes: AgentNodeType[] = AGENTS.map((agent, i) => {
      const step = workflow.steps[i];
      const startedAt =
        i === 0 ? workflow.createdAt : workflow.steps[i - 1]?.createdAt;
      return {
        id: agent.name,
        type: "agent",
        position: { x: i * 320, y: 0 },
        data: {
          agent,
          index: i,
          state: states[i],
          duration:
            step && startedAt
              ? formatDuration(startedAt, step.createdAt)
              : undefined,
        },
      };
    });

    const edges: Edge[] = AGENTS.slice(1).map((agent, i) => ({
      id: `${AGENTS[i].name}-${agent.name}`,
      source: AGENTS[i].name,
      target: agent.name,
      type: "smoothstep",
      animated: states[i + 1] === "running",
      className: cn(
        states[i] === "done" && "is-done",
        states[i + 1] === "failed" && "is-failed",
      ),
    }));

    return { nodes, edges };
  }, [workflow]);

  return (
    <div className="h-64 w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
      </ReactFlow>
    </div>
  );
}

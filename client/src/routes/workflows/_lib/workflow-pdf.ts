import type { WorkflowDetail } from "@server";
import { jsPDF } from "jspdf";
import { formatDateTime, formatDuration } from "#/lib/format";
import { AGENTS } from "#/routes/workflows/_lib/agents";
import { toPlainText } from "#/routes/workflows/_lib/parser";

const MARGIN = 48;

export function downloadWorkflowPdf(workflow: WorkflowDetail) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth() - MARGIN * 2;
  const bottom = doc.internal.pageSize.getHeight() - MARGIN;
  let y = MARGIN;

  function write(
    text: string,
    { size = 10, bold = false, gap = 6, muted = false } = {},
  ) {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(muted ? 110 : 20);
    const lineHeight = size * 1.45;
    for (const line of doc.splitTextToSize(text, width) as string[]) {
      if (y + lineHeight > bottom) {
        doc.addPage();
        y = MARGIN;
      }
      doc.text(line, MARGIN, y);
      y += lineHeight;
    }
    y += gap;
  }

  write(`Workflow #${workflow.id}`, { size: 18, bold: true });
  write(workflow.task, { size: 12, gap: 4 });
  write(
    [
      `Status: ${workflow.status === "completed" ? "generated" : workflow.status}`,
      `Started ${formatDateTime(workflow.createdAt)}`,
      workflow.completedAt &&
        `took ${formatDuration(workflow.createdAt, workflow.completedAt)}`,
    ]
      .filter(Boolean)
      .join("  ·  "),
    { size: 9, muted: true, gap: 18 },
  );

  AGENTS.forEach((agent, i) => {
    const step = workflow.steps.find((s) => s.agent === agent.name);
    write(`${i + 1}. ${agent.resultTitle} (${agent.name})`, {
      size: 13,
      bold: true,
    });
    write(
      step ? toPlainText(step.output) : "This agent did not produce output.",
      {
        gap: 16,
        muted: !step,
      },
    );
  });

  doc.save(`workflow-${workflow.id}.pdf`);
}

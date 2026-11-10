import type { WorkflowDetail } from "@server";
import { FileJson, FileText } from "lucide-react";
import { DownloadMenu } from "#/components/common/download-menu";
import { useToast } from "#/hooks/use-toast";
import { downloadJson } from "#/lib/download";
import { downloadWorkflowPdf } from "#/routes/workflows/_lib/workflow-pdf";

export function WorkflowDownloadMenu({
  workflow,
  variant,
}: {
  workflow: WorkflowDetail;
  variant?: "outline" | "ghost";
}) {
  const { showSuccessToast, showErrorToast } = useToast();

  function run(format: string, save: () => void) {
    try {
      save();
      showSuccessToast(`${format} downloaded`);
    } catch (error) {
      showErrorToast(error);
    }
  }

  return (
    <DownloadMenu
      variant={variant}
      options={[
        {
          id: "pdf",
          label: "PDF",
          description: "Readable report of every agent",
          icon: FileText,
          onSelect: () => run("PDF", () => downloadWorkflowPdf(workflow)),
        },
        {
          id: "json",
          label: "JSON",
          description: "Raw task, status and steps",
          icon: FileJson,
          onSelect: () =>
            run("JSON", () =>
              downloadJson(workflow, `workflow-${workflow.id}.json`),
            ),
        },
      ]}
    />
  );
}

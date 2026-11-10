import type { LucideIcon } from "lucide-react";

export type DownloadOption = {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  onSelect: () => void;
};

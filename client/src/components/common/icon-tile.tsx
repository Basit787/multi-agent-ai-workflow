import type { LucideIcon } from "lucide-react";
import { cn } from "#/lib/utils";

const TONES = {
  muted: "border bg-muted text-foreground",
  outline: "border bg-background text-foreground",
  primary: "bg-primary text-primary-foreground",
  success: "bg-success/15 text-success",
  destructive: "bg-destructive/15 text-destructive",
};

const SIZES = {
  sm: "size-8 rounded-md [&_svg]:size-4",
  md: "size-9 rounded-lg [&_svg]:size-4",
  lg: "size-11 rounded-full [&_svg]:size-5",
};

export function IconTile({
  icon: Icon,
  tone = "muted",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        TONES[tone],
        SIZES[size],
        className,
      )}
    >
      <Icon />
    </span>
  );
}

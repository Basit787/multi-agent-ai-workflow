import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import { cn } from "#/lib/utils";

const VARIANTS = {
  info: { icon: Info, className: "" },
  success: {
    icon: CircleCheck,
    className: "border-success/40 text-success [&>svg]:text-success",
  },
  destructive: { icon: CircleAlert, className: "" },
} satisfies Record<string, { icon: LucideIcon; className: string }>;

export function AppAlert({
  variant = "info",
  title,
  description,
  icon,
  action,
  className,
}: {
  variant?: keyof typeof VARIANTS;
  title?: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}) {
  const Icon = icon ?? VARIANTS[variant].icon;
  return (
    <Alert
      variant={variant === "destructive" ? "destructive" : "default"}
      className={cn(VARIANTS[variant].className, className)}
    >
      <Icon />
      {title && <AlertTitle>{title}</AlertTitle>}
      {(description || action) && (
        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
          {description}
          {action}
        </AlertDescription>
      )}
    </Alert>
  );
}

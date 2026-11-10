import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { cn } from "#/lib/utils";

export function AppCard({
  title,
  description,
  icon,
  action,
  footer,
  children,
  tone = "default",
  className,
  contentClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  tone?: "default" | "success" | "muted";
  className?: string;
  contentClassName?: string;
}) {
  const hasHeader = title || description || action;
  return (
    <Card
      className={cn(
        tone === "success" && "border-success/40 bg-success/5",
        tone === "muted" && "bg-muted/40",
        className,
      )}
    >
      {hasHeader && (
        <CardHeader>
          <div className="flex items-center gap-3">
            {icon}
            <div className="grid gap-1">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      {children && (
        <CardContent className={contentClassName}>{children}</CardContent>
      )}
      {footer && <CardFooter className="border-t">{footer}</CardFooter>}
    </Card>
  );
}

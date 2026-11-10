import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  badge,
  meta,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="max-w-3xl text-muted-foreground">{description}</p>
        )}
        {meta && <p className="text-xs text-muted-foreground">{meta}</p>}
      </div>
      {actions}
    </div>
  );
}

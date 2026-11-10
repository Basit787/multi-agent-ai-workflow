import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { AppShell } from "#/components/layout/app-shell";
import { FullPageSpinner } from "#/components/layout/full-page-spinner";
import { useLogout, useSession, useSessionExpiry } from "../_lib/api/hook";
import { useWorkflowEvents } from "./_lib/api/hook";

export const Route = createFileRoute("/workflows")({
  ssr: false,
  component: WorkflowsLayout,
});

function WorkflowsLayout() {
  const { user, isLoading } = useSession();
  const logout = useLogout();
  useSessionExpiry();
  useWorkflowEvents(!!user);

  if (isLoading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/" />;

  return (
    <AppShell
      user={user}
      onSignOut={() => logout.mutate()}
      isSigningOut={logout.isPending}
    >
      <Outlet />
    </AppShell>
  );
}

import { createFileRoute, Navigate } from "@tanstack/react-router";
import { FullPageSpinner } from "#/components/layout/full-page-spinner";
import { useSession } from "./_lib/api/hook";
import { AuthScreen } from "./_lib/components/auth-screen";

export const Route = createFileRoute("/")({ ssr: false, component: SignIn });

function SignIn() {
  const { user, isLoading } = useSession();
  if (isLoading) return <FullPageSpinner />;
  if (user) return <Navigate to="/workflows" />;
  return <AuthScreen />;
}

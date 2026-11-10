import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Brand } from "#/components/layout/brand";
import { UserMenu } from "#/components/layout/user-menu";

export function AppShell({
  user,
  onSignOut,
  isSigningOut,
  children,
}: {
  user: { email: string; role: string };
  onSignOut: () => void;
  isSigningOut: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <Link to="/workflows">
            <Brand />
          </Link>
          <UserMenu
            user={user}
            onSignOut={onSignOut}
            isSigningOut={isSigningOut}
          />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

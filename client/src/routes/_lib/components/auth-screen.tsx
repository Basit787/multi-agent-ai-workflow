import { Brand } from "#/components/layout/brand";
import { ThemeToggle } from "#/components/layout/theme-toggle";
import { AuthForm } from "./auth-form";
import { AuthHero } from "./auth-hero";

export function AuthScreen() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <AuthHero />
      <main className="flex flex-col p-6">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden">
            <Brand />
          </div>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <AuthForm />
        </div>
      </main>
    </div>
  );
}

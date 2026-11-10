import { useForm } from "@tanstack/react-form";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { AppCard } from "#/components/common/app-card";
import { FieldError } from "#/components/field-error";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useAuthenticate } from "../api/hook";
import type { AuthMode } from "../types";
import { AuthModeTabs } from "./auth-mode-tabs";

const authSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

const COPY = {
  login: {
    title: "Welcome back",
    description: "Sign in to run a workflow.",
    submit: "Sign in",
  },
  register: {
    title: "Create an account",
    description: "Sign up with your email to get started.",
    submit: "Create account",
  },
};

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const authenticate = useAuthenticate(mode);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: authSchema },
    onSubmit: ({ value }) => authenticate.mutateAsync(value).catch(() => {}),
  });

  return (
    <AppCard
      className="w-full max-w-sm"
      title={<span className="text-xl">{COPY[mode].title}</span>}
      description={COPY[mode].description}
      contentClassName="space-y-6"
    >
      <AuthModeTabs mode={mode} onChange={setMode} />
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Email</Label>
              <Input
                id={field.name}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Password</Label>
              <Input
                id={field.name}
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
        <Button
          type="submit"
          className="w-full"
          disabled={authenticate.isPending}
        >
          {authenticate.isPending && <LoaderCircle className="animate-spin" />}
          {COPY[mode].submit}
        </Button>
      </form>
    </AppCard>
  );
}

import type { authClient } from "#/lib/auth-client";

export type AuthMode = "login" | "register";
export type Credentials = Pick<
  Parameters<typeof authClient.signIn.email>[0],
  "email" | "password"
>;
export type AuthResult = {
  error: { message?: string; status: number } | null;
};

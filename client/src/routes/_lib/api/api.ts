import type { AuthUser } from "@server";
import { authClient } from "#/lib/auth-client";
import { ApiError } from "#/lib/axios";
import { toApiError } from "#/lib/parser";
import { toUser } from "../parser";
import type { AuthMode, Credentials } from "../types";
import { throwIfError } from "../utils";

export async function authenticate(
  mode: AuthMode,
  { email, password }: Credentials,
): Promise<AuthUser> {
  try {
    const result =
      mode === "login"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({
            email,
            password,
            name: email.split("@")[0],
          });
    throwIfError(result);
    if (!result.data) throw new ApiError("Request failed");
    return toUser(result.data.user);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getMe(): Promise<AuthUser | null> {
  try {
    const result = await authClient.getSession();
    throwIfError(result);
    return result.data ? toUser(result.data.user) : null;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function logout(): Promise<void> {
  try {
    throwIfError(await authClient.signOut());
  } catch (error) {
    throw toApiError(error);
  }
}

import { ApiError } from "#/lib/axios";
import type { AuthResult } from "./types";

export function throwIfError(result: AuthResult) {
  if (result.error) {
    throw new ApiError(
      result.error.message ?? "Request failed",
      result.error.status,
    );
  }
}

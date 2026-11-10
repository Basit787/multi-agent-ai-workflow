import type { ApiErrorBody } from "@server";
import axios from "axios";
import { ApiError } from "#/lib/axios";

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError<Partial<ApiErrorBody>>(error)) {
    if (!error.response) return new ApiError("Can't reach the server");
    return new ApiError(
      error.response.data?.error ?? "Request failed",
      error.response.status,
    );
  }
  return new ApiError(
    error instanceof Error ? error.message : "Request failed",
  );
}

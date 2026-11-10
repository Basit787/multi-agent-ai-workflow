import type { AuthUser } from "@server";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useToast } from "#/hooks/use-toast";
import { http } from "#/lib/axios";
import { queryClient } from "#/lib/query-client";
import type { AuthMode, Credentials } from "../types";
import { authenticate, getMe, logout } from "./api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}

export function useSession() {
  const me = useMe();
  return { user: me.data ?? null, isLoading: me.isPending };
}

export function useAuthenticate(mode: AuthMode) {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (credentials: Credentials) => authenticate(mode, credentials),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(["me"], user);
      showSuccessToast(mode === "login" ? "Welcome back" : "Account created", {
        description: user.email,
      });
      navigate({ to: "/workflows" });
    },
    onError: (error) => showErrorToast(error),
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => showSuccessToast("Signed out"),
    onError: (error) => showErrorToast(error),
    onSettled: () => {
      queryClient.clear();
      queryClient.setQueryData(["me"], null);
      navigate({ to: "/" });
    },
  });
}

export function useSessionExpiry() {
  const { showErrorToast } = useToast();

  useEffect(() => {
    http.setSessionExpiredHandler(() => {
      queryClient.setQueryData(["me"], null);
      showErrorToast(new Error("Your session expired. Please sign in again."));
    });
    return () => http.setSessionExpiredHandler(() => {});
  }, [showErrorToast]);
}

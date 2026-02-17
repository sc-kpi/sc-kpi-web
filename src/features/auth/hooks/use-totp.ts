"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  disableTotp,
  getTotpStatus,
  regenerateRecoveryCodes,
  setupTotp,
  verifyTotpSetup,
} from "../api";
import type { TotpDisableRequest, TotpVerifyRequest } from "../types";

const TOTP_STATUS_KEY = ["auth", "totp-status"] as const;
const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useTotpStatus() {
  return useQuery({
    queryKey: TOTP_STATUS_KEY,
    queryFn: getTotpStatus,
    staleTime: 60 * 1000,
  });
}

export function useSetupTotp() {
  return useMutation({
    mutationFn: setupTotp,
  });
}

export function useVerifySetup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TotpVerifyRequest) => verifyTotpSetup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOTP_STATUS_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useDisableTotp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TotpDisableRequest) => disableTotp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOTP_STATUS_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useRegenerateRecoveryCodes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TotpVerifyRequest) => regenerateRecoveryCodes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOTP_STATUS_KEY });
    },
  });
}

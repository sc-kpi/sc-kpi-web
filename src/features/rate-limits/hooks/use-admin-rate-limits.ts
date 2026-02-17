"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRateLimit,
  deleteRateLimit,
  getAdminRateLimit,
  getAdminRateLimits,
  toggleRateLimit,
  updateRateLimit,
} from "../api";
import type {
  CreateRateLimitRuleRequest,
  RateLimitToggleRequest,
  UpdateRateLimitRuleRequest,
} from "../types";

const ADMIN_RATE_LIMITS_KEY = ["admin-rate-limits"] as const;
const adminRateLimitKey = (id: string) => ["admin-rate-limits", id] as const;

export function useAdminRateLimits(page = 0, size = 20) {
  return useQuery({
    queryKey: [...ADMIN_RATE_LIMITS_KEY, { page, size }],
    queryFn: () => getAdminRateLimits(page, size),
  });
}

export function useAdminRateLimit(id: string) {
  return useQuery({
    queryKey: adminRateLimitKey(id),
    queryFn: () => getAdminRateLimit(id),
    enabled: !!id,
  });
}

export function useCreateRateLimitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRateLimitRuleRequest) => createRateLimit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_RATE_LIMITS_KEY });
    },
  });
}

export function useUpdateRateLimitMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRateLimitRuleRequest) => updateRateLimit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRateLimitKey(id) });
      queryClient.invalidateQueries({ queryKey: ADMIN_RATE_LIMITS_KEY });
    },
  });
}

export function useToggleRateLimitMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RateLimitToggleRequest) => toggleRateLimit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRateLimitKey(id) });
      queryClient.invalidateQueries({ queryKey: ADMIN_RATE_LIMITS_KEY });
    },
  });
}

export function useDeleteRateLimitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRateLimit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_RATE_LIMITS_KEY });
    },
  });
}

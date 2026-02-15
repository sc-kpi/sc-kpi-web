"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addOverride,
  createFeatureFlag,
  deleteFeatureFlag,
  getAdminFeatureFlag,
  getAdminFeatureFlags,
  removeOverride,
  toggleFeatureFlag,
  updateFeatureFlag,
} from "../api";
import type {
  CreateFeatureFlagRequest,
  CreateOverrideRequest,
  ToggleFeatureFlagRequest,
  UpdateFeatureFlagRequest,
} from "../types";

const ADMIN_FLAGS_KEY = ["admin-feature-flags"] as const;
const adminFlagKey = (id: string) => ["admin-feature-flags", id] as const;

export function useAdminFeatureFlags(page = 0, size = 20) {
  return useQuery({
    queryKey: [...ADMIN_FLAGS_KEY, { page, size }],
    queryFn: () => getAdminFeatureFlags(page, size),
  });
}

export function useAdminFeatureFlag(id: string) {
  return useQuery({
    queryKey: adminFlagKey(id),
    queryFn: () => getAdminFeatureFlag(id),
    enabled: !!id,
  });
}

export function useCreateFeatureFlagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFeatureFlagRequest) => createFeatureFlag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_FLAGS_KEY });
    },
  });
}

export function useUpdateFeatureFlagMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateFeatureFlagRequest) => updateFeatureFlag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFlagKey(id) });
      queryClient.invalidateQueries({ queryKey: ADMIN_FLAGS_KEY });
    },
  });
}

export function useToggleFeatureFlagMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ToggleFeatureFlagRequest) => toggleFeatureFlag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFlagKey(id) });
      queryClient.invalidateQueries({ queryKey: ADMIN_FLAGS_KEY });
    },
  });
}

export function useDeleteFeatureFlagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeatureFlag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_FLAGS_KEY });
    },
  });
}

export function useAddOverrideMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOverrideRequest) => addOverride(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFlagKey(id) });
    },
  });
}

export function useRemoveOverrideMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (overrideId: string) => removeOverride(id, overrideId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFlagKey(id) });
    },
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  broadcast,
  cleanupNotifications,
  getAdminNotifications,
  getNotificationStats,
} from "../api";
import type { BroadcastRequest, NotificationFilterParams } from "../types";

export function useAdminNotifications(params?: NotificationFilterParams & { search?: string }) {
  return useQuery({
    queryKey: ["admin", "notifications", params],
    queryFn: () => getAdminNotifications(params),
  });
}

export function useBroadcastMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: BroadcastRequest) => broadcast(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

export function useNotificationStats() {
  return useQuery({
    queryKey: ["admin", "notifications", "stats"],
    queryFn: getNotificationStats,
  });
}

export function useCleanupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (days: number) => cleanupNotifications(days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllAsRead, markAsRead, markBatchAsRead } from "../api";
import type { MarkReadRequest } from "../types";

export function useMarkReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkBatchReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: MarkReadRequest) => markBatchAsRead(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

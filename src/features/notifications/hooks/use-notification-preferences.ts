"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPreferences, updatePreferences } from "../api";
import type { UpdatePreferencesRequest } from "../types";

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ["notifications", "preferences"],
    queryFn: getPreferences,
  });
}

export function useUpdatePreferencesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdatePreferencesRequest) => updatePreferences(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "preferences"] });
    },
  });
}

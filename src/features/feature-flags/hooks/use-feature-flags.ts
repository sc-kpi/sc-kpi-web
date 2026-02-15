"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeatureFlags } from "../api";

const FEATURE_FLAGS_KEY = ["feature-flags"] as const;

export function useFeatureFlags() {
  return useQuery({
    queryKey: FEATURE_FLAGS_KEY,
    queryFn: getFeatureFlags,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

"use client";

import { useFeatureFlags } from "./use-feature-flags";

export function useFeatureFlag(key: string): boolean {
  const { data } = useFeatureFlags();
  return data?.[key] ?? false;
}

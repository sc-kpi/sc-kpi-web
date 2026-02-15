"use client";

import type { ReactNode } from "react";
import { useFeatureFlag } from "../hooks/use-feature-flag";

interface FeatureFlagProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureFlag({ flag, children, fallback = null }: FeatureFlagProps) {
  const enabled = useFeatureFlag(flag);

  if (!enabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

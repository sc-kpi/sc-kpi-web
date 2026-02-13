"use client";

import { usePermission } from "../hooks/use-permission";
import type { CapabilityTier } from "../types";

interface CanAccessProps {
  tier: CapabilityTier;
  children: React.ReactNode;
}

export function CanAccess({ tier, children }: CanAccessProps) {
  const hasPermission = usePermission(tier);
  if (!hasPermission) return null;
  return children;
}

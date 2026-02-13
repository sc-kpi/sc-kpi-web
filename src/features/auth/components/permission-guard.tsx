"use client";

import { usePermission } from "../hooks/use-permission";
import type { CapabilityTier } from "../types";

interface PermissionGuardProps {
  requiredTier: CapabilityTier;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ requiredTier, fallback = null, children }: PermissionGuardProps) {
  const hasPermission = usePermission(requiredTier);
  if (!hasPermission) return fallback;
  return children;
}

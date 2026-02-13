"use client";

import { CAPABILITY_TIERS, type CapabilityTier } from "../types";
import { useAuth } from "./use-auth";

export function usePermission(requiredTier: CapabilityTier): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return user.capabilityTier >= requiredTier;
}

export function useIsAdmin(): boolean {
  return usePermission(CAPABILITY_TIERS.ADMIN);
}

export function useIsSenior(): boolean {
  return usePermission(CAPABILITY_TIERS.SENIOR);
}

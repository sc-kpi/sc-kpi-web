"use client";

import { CAPABILITY_TIERS } from "../types";
import { useAuth } from "./use-auth";

const PARTNER_LEVEL_TIERS: Record<string, number> = {
  full: 2,
  documents: 2,
  basic: 1,
};

export function useHasPartnerRole(partnerId: string, level?: string): boolean {
  const { user } = useAuth();
  if (!user) return false;
  if (user.capabilityTier >= CAPABILITY_TIERS.ADMIN) return true;

  const role = user.partnerRoles.find((r) => r.partnerId === partnerId);
  if (!role) return false;
  if (!level) return true;

  const userLevelTier = PARTNER_LEVEL_TIERS[role.level] ?? 0;
  const requiredTier = PARTNER_LEVEL_TIERS[level] ?? 0;
  return userLevelTier >= requiredTier;
}

export function useEffectiveTierForPartner(partnerId: string): number {
  const { user } = useAuth();
  if (!user) return 0;
  if (user.capabilityTier >= CAPABILITY_TIERS.ADMIN) return user.capabilityTier;

  const role = user.partnerRoles.find((r) => r.partnerId === partnerId);
  if (!role) return 0;

  const partnerTier = PARTNER_LEVEL_TIERS[role.level] ?? 0;
  return Math.min(user.capabilityTier, partnerTier);
}

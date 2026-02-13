/**
 * Permission-based access control tiers (mirrors backend PBAC)
 * 0 = Guest, 1 = Basic, 2 = Internal, 3 = Advanced, 4 = Senior, 5 = Admin
 */
export type CapabilityTier = 0 | 1 | 2 | 3 | 4 | 5;

export const CAPABILITY_TIERS = {
  GUEST: 0,
  BASIC: 1,
  INTERNAL: 2,
  ADVANCED: 3,
  SENIOR: 4,
  ADMIN: 5,
} as const satisfies Record<string, CapabilityTier>;

export interface PartnerRole {
  partnerId: string;
  level: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  capabilityTier: CapabilityTier;
  partnerRoles: PartnerRole[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

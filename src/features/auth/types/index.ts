/**
 * Permission-based access control tiers (mirrors backend PBAC)
 * 0 = Guest, 1 = Authenticated, 2 = Member, 3 = Head, 4 = Moderator, 5 = Admin
 */
export type CapabilityTier = 0 | 1 | 2 | 3 | 4 | 5;

export const CAPABILITY_TIERS = {
  GUEST: 0,
  AUTHENTICATED: 1,
  MEMBER: 2,
  HEAD: 3,
  MODERATOR: 4,
  ADMIN: 5,
} as const satisfies Record<string, CapabilityTier>;

export interface DepartmentRole {
  departmentId: string;
  role: string;
}

export interface ProjectRole {
  projectId: string;
  role: string;
}

export interface PartnerRole {
  partnerId: string;
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  capabilityTier: CapabilityTier;
  avatarUrl?: string;
  departmentRoles: DepartmentRole[];
  projectRoles: ProjectRole[];
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

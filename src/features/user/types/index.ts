export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  capabilityTier: number;
  active: boolean;
  createdAt: string;
  partnerRoles: UserPartnerRole[];
}

export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  capabilityTier: number;
  active: boolean;
}

export interface UserPartnerRole {
  partnerId: string;
  level: string;
  assignedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tier: number;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
}

export interface UpdateTierRequest {
  tier: number;
}

export interface UpdateStatusRequest {
  active: boolean;
}

export interface AssignPartnerLevelRequest {
  partnerId: string;
  level: string;
}

import { api } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  AssignPartnerLevelRequest,
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserListItem,
  UserPartnerRole,
} from "../types";

export function getUsers(page = 0, size = 20): Promise<PaginatedResponse<UserListItem>> {
  return api.get<PaginatedResponse<UserListItem>>(API_ROUTES.users.base, {
    params: { page: String(page), size: String(size) },
  });
}

export function getUserById(id: string): Promise<User> {
  return api.get<User>(API_ROUTES.users.byId(id));
}

export function createUser(data: CreateUserRequest): Promise<User> {
  return api.post<User>(API_ROUTES.users.base, data);
}

export function updateUser(id: string, data: UpdateUserRequest): Promise<User> {
  return api.patch<User>(API_ROUTES.users.byId(id), data);
}

export function updateUserTier(id: string, tier: number): Promise<User> {
  return api.patch<User>(API_ROUTES.users.tier(id), { tier });
}

export function updateUserStatus(id: string, active: boolean): Promise<User> {
  return api.patch<User>(API_ROUTES.users.status(id), { active });
}

export function deleteUser(id: string): Promise<void> {
  return api.delete<void>(API_ROUTES.users.byId(id));
}

export function assignPartnerLevel(
  id: string,
  data: AssignPartnerLevelRequest,
): Promise<UserPartnerRole> {
  return api.post<UserPartnerRole>(API_ROUTES.users.partners(id), data);
}

export function removePartnerLevel(id: string, partnerId: string): Promise<void> {
  return api.delete<void>(API_ROUTES.users.partner(id, partnerId));
}

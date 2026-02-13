import { api } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import type { AuthUser, LoginRequest, RegisterRequest } from "../types";

export function login(data: LoginRequest): Promise<AuthUser> {
  return api.post<AuthUser>(API_ROUTES.auth.login, data);
}

export function register(data: RegisterRequest): Promise<AuthUser> {
  return api.post<AuthUser>(API_ROUTES.auth.register, data);
}

export function logout(): Promise<void> {
  return api.post<void>(API_ROUTES.auth.logout);
}

export function getMe(): Promise<AuthUser> {
  return api.get<AuthUser>(API_ROUTES.auth.me);
}

export function forgotPassword(email: string): Promise<void> {
  return api.post<void>(API_ROUTES.auth.forgotPassword, { email });
}

export function resetPassword(token: string, newPassword: string): Promise<void> {
  return api.post<void>(API_ROUTES.auth.resetPassword, { token, newPassword });
}

import { api } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RecoveryCodesResponse,
  RegisterRequest,
  TotpDisableRequest,
  TotpSetupResponse,
  TotpStatusResponse,
  TotpVerifyRequest,
} from "../types";

export function login(data: LoginRequest): Promise<LoginResponse> {
  return api.post<LoginResponse>(API_ROUTES.auth.login, data);
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

export function setupTotp(): Promise<TotpSetupResponse> {
  return api.post<TotpSetupResponse>(API_ROUTES.auth.twoFactor.setup);
}

export function verifyTotpSetup(data: TotpVerifyRequest): Promise<RecoveryCodesResponse> {
  return api.post<RecoveryCodesResponse>(API_ROUTES.auth.twoFactor.verifySetup, data);
}

export function disableTotp(data: TotpDisableRequest): Promise<void> {
  return api.post<void>(API_ROUTES.auth.twoFactor.disable, data);
}

export function getTotpStatus(): Promise<TotpStatusResponse> {
  return api.get<TotpStatusResponse>(API_ROUTES.auth.twoFactor.status);
}

export function regenerateRecoveryCodes(data: TotpVerifyRequest): Promise<RecoveryCodesResponse> {
  return api.post<RecoveryCodesResponse>(API_ROUTES.auth.twoFactor.regenerateRecoveryCodes, data);
}

export function verifyLoginTotp(data: TotpVerifyRequest): Promise<LoginResponse> {
  return api.post<LoginResponse>(API_ROUTES.auth.twoFactor.verifyLogin, data);
}

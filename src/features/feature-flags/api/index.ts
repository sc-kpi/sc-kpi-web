import { api } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  CreateFeatureFlagRequest,
  CreateOverrideRequest,
  FeatureFlagAuditEntry,
  FeatureFlagDto,
  FeatureFlagOverrideDto,
  FeatureFlags,
  ToggleFeatureFlagRequest,
  UpdateFeatureFlagRequest,
} from "../types";

export function getFeatureFlags(): Promise<FeatureFlags> {
  return api.get<FeatureFlags>(API_ROUTES.featureFlags.base);
}

export function getAdminFeatureFlags(
  page = 0,
  size = 20,
): Promise<PaginatedResponse<FeatureFlagDto>> {
  return api.get<PaginatedResponse<FeatureFlagDto>>(API_ROUTES.featureFlags.admin, {
    params: { page: String(page), size: String(size) },
  });
}

export function getAdminFeatureFlag(id: string): Promise<FeatureFlagDto> {
  return api.get<FeatureFlagDto>(API_ROUTES.featureFlags.adminById(id));
}

export function createFeatureFlag(data: CreateFeatureFlagRequest): Promise<FeatureFlagDto> {
  return api.post<FeatureFlagDto>(API_ROUTES.featureFlags.admin, data);
}

export function updateFeatureFlag(
  id: string,
  data: UpdateFeatureFlagRequest,
): Promise<FeatureFlagDto> {
  return api.patch<FeatureFlagDto>(API_ROUTES.featureFlags.adminById(id), data);
}

export function toggleFeatureFlag(
  id: string,
  data: ToggleFeatureFlagRequest,
): Promise<FeatureFlagDto> {
  return api.patch<FeatureFlagDto>(API_ROUTES.featureFlags.adminToggle(id), data);
}

export function deleteFeatureFlag(id: string): Promise<void> {
  return api.delete<void>(API_ROUTES.featureFlags.adminById(id));
}

export function addOverride(
  id: string,
  data: CreateOverrideRequest,
): Promise<FeatureFlagOverrideDto> {
  return api.post<FeatureFlagOverrideDto>(API_ROUTES.featureFlags.adminOverrides(id), data);
}

export function removeOverride(id: string, overrideId: string): Promise<void> {
  return api.delete<void>(API_ROUTES.featureFlags.adminOverride(id, overrideId));
}

export function getAuditLog(
  id: string,
  page = 0,
  size = 20,
): Promise<PaginatedResponse<FeatureFlagAuditEntry>> {
  return api.get<PaginatedResponse<FeatureFlagAuditEntry>>(
    API_ROUTES.featureFlags.adminAuditLog(id),
    { params: { page: String(page), size: String(size) } },
  );
}

export function getAllAuditLogs(
  page = 0,
  size = 20,
): Promise<PaginatedResponse<FeatureFlagAuditEntry>> {
  return api.get<PaginatedResponse<FeatureFlagAuditEntry>>(
    API_ROUTES.featureFlags.adminAllAuditLogs,
    { params: { page: String(page), size: String(size) } },
  );
}

import { api } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  CreateRateLimitRuleRequest,
  RateLimitRuleDto,
  RateLimitStatsDto,
  RateLimitToggleRequest,
  UpdateRateLimitRuleRequest,
} from "../types";

export function getAdminRateLimits(
  page = 0,
  size = 20,
): Promise<PaginatedResponse<RateLimitRuleDto>> {
  return api.get<PaginatedResponse<RateLimitRuleDto>>(API_ROUTES.rateLimits.admin, {
    params: { page: String(page), size: String(size) },
  });
}

export function getAdminRateLimit(id: string): Promise<RateLimitRuleDto> {
  return api.get<RateLimitRuleDto>(API_ROUTES.rateLimits.adminById(id));
}

export function createRateLimit(data: CreateRateLimitRuleRequest): Promise<RateLimitRuleDto> {
  return api.post<RateLimitRuleDto>(API_ROUTES.rateLimits.admin, data);
}

export function updateRateLimit(
  id: string,
  data: UpdateRateLimitRuleRequest,
): Promise<RateLimitRuleDto> {
  return api.patch<RateLimitRuleDto>(API_ROUTES.rateLimits.adminById(id), data);
}

export function toggleRateLimit(
  id: string,
  data: RateLimitToggleRequest,
): Promise<RateLimitRuleDto> {
  return api.patch<RateLimitRuleDto>(API_ROUTES.rateLimits.adminToggle(id), data);
}

export function deleteRateLimit(id: string): Promise<void> {
  return api.delete<void>(API_ROUTES.rateLimits.adminById(id));
}

export function getRateLimitStats(): Promise<RateLimitStatsDto> {
  return api.get<RateLimitStatsDto>(API_ROUTES.rateLimits.adminStats);
}

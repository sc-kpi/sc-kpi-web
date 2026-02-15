import { api } from "@/lib/api-client";
import { API_BASE_URL, API_ROUTES } from "@/lib/constants";
import type { PaginatedResponse } from "@/shared/types/api";
import type { AuditEventDto, AuditFilterParams, AuditStatsDto } from "../types";

export function getAuditLogs(
  params: AuditFilterParams = {},
): Promise<PaginatedResponse<AuditEventDto>> {
  const queryParams: Record<string, string> = {};
  if (params.actorId) queryParams.actorId = params.actorId;
  if (params.entityType) queryParams.entityType = params.entityType;
  if (params.action) queryParams.action = params.action;
  if (params.sourceModule) queryParams.sourceModule = params.sourceModule;
  if (params.entityId) queryParams.entityId = params.entityId;
  if (params.from) queryParams.from = params.from;
  if (params.to) queryParams.to = params.to;
  if (params.search) queryParams.search = params.search;
  queryParams.page = String(params.page ?? 0);
  queryParams.size = String(params.size ?? 20);
  queryParams.sort = "createdAt,desc";

  return api.get<PaginatedResponse<AuditEventDto>>(API_ROUTES.audit.base, {
    params: queryParams,
  });
}

export function getAuditStats(): Promise<AuditStatsDto> {
  return api.get<AuditStatsDto>(API_ROUTES.audit.stats);
}

export async function downloadAuditCsv(params: AuditFilterParams = {}): Promise<void> {
  const url = new URL(`${API_BASE_URL}${API_ROUTES.audit.export}`);
  if (params.entityType) url.searchParams.set("entityType", params.entityType);
  if (params.action) url.searchParams.set("action", params.action);
  if (params.sourceModule) url.searchParams.set("sourceModule", params.sourceModule);
  if (params.from) url.searchParams.set("from", params.from);
  if (params.to) url.searchParams.set("to", params.to);
  if (params.search) url.searchParams.set("search", params.search);

  const response = await fetch(url.toString(), { credentials: "include" });
  if (!response.ok) throw new Error("Export failed");

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

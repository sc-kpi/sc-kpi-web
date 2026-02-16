import { api } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  BroadcastRequest,
  MarkReadRequest,
  NotificationDto,
  NotificationFilterParams,
  NotificationPreferenceDto,
  NotificationStatsDto,
  UnreadCountDto,
  UpdatePreferencesRequest,
} from "../types";

function toStringParams(params?: object): Record<string, string> | undefined {
  if (!params) return undefined;
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      result[key] = String(value);
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

export function getNotifications(
  params?: NotificationFilterParams,
): Promise<PaginatedResponse<NotificationDto>> {
  return api.get<PaginatedResponse<NotificationDto>>(API_ROUTES.notifications.base, {
    params: toStringParams(params),
  });
}

export function getUnreadCount(): Promise<UnreadCountDto> {
  return api.get<UnreadCountDto>(API_ROUTES.notifications.unreadCount);
}

export function markAsRead(id: string): Promise<void> {
  return api.patch<void>(API_ROUTES.notifications.markRead(id));
}

export function markBatchAsRead(request: MarkReadRequest): Promise<void> {
  return api.patch<void>(API_ROUTES.notifications.markBatchRead, request);
}

export function markAllAsRead(): Promise<void> {
  return api.patch<void>(API_ROUTES.notifications.markAllRead);
}

export function getPreferences(): Promise<NotificationPreferenceDto[]> {
  return api.get<NotificationPreferenceDto[]>(API_ROUTES.notifications.preferences);
}

export function updatePreferences(
  request: UpdatePreferencesRequest,
): Promise<NotificationPreferenceDto[]> {
  return api.put<NotificationPreferenceDto[]>(API_ROUTES.notifications.preferences, request);
}

export function getAdminNotifications(
  params?: NotificationFilterParams & { search?: string },
): Promise<PaginatedResponse<NotificationDto>> {
  return api.get<PaginatedResponse<NotificationDto>>(API_ROUTES.notifications.admin, {
    params: toStringParams(params),
  });
}

export function broadcast(request: BroadcastRequest): Promise<void> {
  return api.post<void>(API_ROUTES.notifications.adminBroadcast, request);
}

export function getNotificationStats(): Promise<NotificationStatsDto> {
  return api.get<NotificationStatsDto>(API_ROUTES.notifications.adminStats);
}

export function cleanupNotifications(days: number): Promise<{ deleted: number }> {
  return api.delete<{ deleted: number }>(API_ROUTES.notifications.adminCleanup, {
    params: { days: String(days) },
  });
}

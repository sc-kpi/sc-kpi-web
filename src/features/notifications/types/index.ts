export type NotificationCategory = "SECURITY" | "ADMIN" | "SYSTEM" | "FEATURE_FLAG";

export type NotificationChannel = "IN_APP" | "EMAIL";

export interface NotificationDto {
  id: string;
  userId: string;
  titleKey: string;
  bodyKey: string;
  bodyArgs: string[] | null;
  category: NotificationCategory;
  sourceModule: string;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPreferenceDto {
  category: string;
  channel: string;
  enabled: boolean;
}

export interface NotificationFilterParams {
  category?: NotificationCategory;
  read?: boolean;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface UpdatePreferencesRequest {
  preferences: {
    category: string;
    channel: string;
    enabled: boolean;
  }[];
}

export interface BroadcastRequest {
  titleKey: string;
  bodyKey: string;
  bodyArgs?: string[];
  category: NotificationCategory;
  targetTier?: string;
}

export interface NotificationStatsDto {
  total: number;
  last24h: number;
  byCategory: Record<string, number>;
}

export interface UnreadCountDto {
  count: number;
}

export interface MarkReadRequest {
  ids: string[];
}

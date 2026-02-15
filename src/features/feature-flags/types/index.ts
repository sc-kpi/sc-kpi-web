export type FeatureFlags = Record<string, boolean>;

export interface FeatureFlagDto {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  environment: string | null;
  rolloutPercentage: number;
  overrides: FeatureFlagOverrideDto[];
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureFlagOverrideDto {
  id: string;
  overrideType: "TIER" | "USER";
  tierLevel: number | null;
  userId: string | null;
  enabled: boolean;
}

export interface FeatureFlagAuditEntry {
  id: string;
  flagId: string;
  flagKey: string;
  action: string;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  reason: string | null;
  changedBy: string | null;
  changedAt: string;
}

export interface CreateFeatureFlagRequest {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  environment: string;
  rolloutPercentage: number;
}

export interface UpdateFeatureFlagRequest {
  name?: string;
  description?: string;
  enabled?: boolean;
  environment?: string;
  rolloutPercentage?: number;
}

export interface ToggleFeatureFlagRequest {
  enabled: boolean;
  reason?: string;
}

export interface CreateOverrideRequest {
  overrideType: "TIER" | "USER";
  tierLevel?: number;
  userId?: string;
  enabled: boolean;
}

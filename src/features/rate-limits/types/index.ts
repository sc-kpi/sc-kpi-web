export type RateLimitScope = "GLOBAL" | "IP" | "USER" | "TIER";

export interface RateLimitRuleDto {
  id: string;
  name: string;
  description: string | null;
  endpointPattern: string;
  httpMethod: string | null;
  limitPerPeriod: number;
  periodSeconds: number;
  burstCapacity: number;
  scope: RateLimitScope;
  targetTier: number | null;
  targetUserId: string | null;
  timeWindowStart: string | null;
  timeWindowEnd: string | null;
  priority: number;
  enabled: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRateLimitRuleRequest {
  name: string;
  description: string;
  endpointPattern: string;
  httpMethod: string;
  limitPerPeriod: number;
  periodSeconds: number;
  burstCapacity: number;
  scope: RateLimitScope;
  targetTier: number | null;
  targetUserId: string | null;
  timeWindowStart: string | null;
  timeWindowEnd: string | null;
  priority: number;
  enabled: boolean;
}

export interface UpdateRateLimitRuleRequest {
  description?: string;
  endpointPattern?: string;
  httpMethod?: string;
  limitPerPeriod?: number;
  periodSeconds?: number;
  burstCapacity?: number;
  scope?: RateLimitScope;
  targetTier?: number | null;
  targetUserId?: string | null;
  timeWindowStart?: string | null;
  timeWindowEnd?: string | null;
  priority?: number;
  enabled?: boolean;
}

export interface RateLimitToggleRequest {
  enabled: boolean;
}

export interface RateLimitStatsDto {
  totalViolations: number;
  activeBuckets: number;
  violationsByEndpoint: Record<string, number>;
}

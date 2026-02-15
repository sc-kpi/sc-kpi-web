export interface AuditEventDto {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  entityName: string | null;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  details: string | null;
  sourceModule: string;
  ipAddress: string | null;
  createdAt: string;
}

export interface AuditFilterParams {
  actorId?: string;
  entityType?: string;
  action?: string;
  sourceModule?: string;
  entityId?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface AuditStatsDto {
  totalEvents: number;
  eventsLast24h: number;
  byEntityType: Record<string, number>;
  byAction: Record<string, number>;
}

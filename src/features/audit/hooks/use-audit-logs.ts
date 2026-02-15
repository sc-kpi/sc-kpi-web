"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuditLogs, getAuditStats } from "../api";
import type { AuditFilterParams } from "../types";

const AUDIT_LOGS_KEY = ["admin-audit-logs"] as const;

export function useAuditLogs(filters: AuditFilterParams = {}) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_KEY, filters],
    queryFn: () => getAuditLogs(filters),
  });
}

export function useAuditStats() {
  return useQuery({
    queryKey: [...AUDIT_LOGS_KEY, "stats"],
    queryFn: () => getAuditStats(),
  });
}

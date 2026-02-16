"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api";
import type { NotificationFilterParams } from "../types";

export function useNotifications(filters?: NotificationFilterParams) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => getNotifications(filters),
  });
}

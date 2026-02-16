"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { API_BASE_URL, API_ROUTES } from "@/lib/constants";
import type { NotificationDto } from "../types";

export function useNotificationSSE(enabled = true) {
  const queryClient = useQueryClient();
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let eventSource: EventSource | null = null;

    function connect() {
      eventSource = new EventSource(`${API_BASE_URL}${API_ROUTES.notifications.stream}`, {
        withCredentials: true,
      });

      eventSource.addEventListener("notification", (event) => {
        JSON.parse(event.data) as NotificationDto;
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({
          queryKey: ["notifications", "unread-count"],
        });
        retryCountRef.current = 0;
      });

      eventSource.onerror = () => {
        eventSource?.close();
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 30_000);
        retryCountRef.current++;
        retryTimeoutRef.current = setTimeout(connect, delay);
      };

      eventSource.onopen = () => {
        retryCountRef.current = 0;
      };
    }

    connect();

    return () => {
      eventSource?.close();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [enabled, queryClient]);
}

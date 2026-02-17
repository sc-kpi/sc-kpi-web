"use client";

import { CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { NotificationDto } from "../types";

interface NotificationItemProps {
  notification: NotificationDto;
  onMarkRead?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const t = useTranslations("notifications");

  const categoryColors: Record<string, string> = {
    SECURITY: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    SYSTEM: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    FEATURE_FLAG: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return t("justNow");
    if (minutes < 60) return t("minutesAgo", { count: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t("hoursAgo", { count: hours });
    const days = Math.floor(hours / 24);
    return t("daysAgo", { count: days });
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
        notification.read ? "bg-background" : "bg-muted/50"
      }`}
    >
      {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {t(`titles.${notification.titleKey}`, { default: notification.titleKey })}
          </span>
          <Badge variant="outline" className={categoryColors[notification.category]}>
            {t(`categories.${notification.category}`)}
          </Badge>
        </div>
        <p className="mt-1 text-muted-foreground text-sm">
          {t(`bodies.${notification.bodyKey}`, { default: notification.bodyKey })}
        </p>
        <span className="mt-1 text-muted-foreground text-xs">
          {timeAgo(notification.createdAt)}
        </span>
      </div>
      {!notification.read && onMarkRead && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onMarkRead(notification.id)}
          title={t("markRead")}
        >
          <CheckCheck className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";
import { useMarkAllReadMutation, useMarkReadMutation } from "../hooks/use-mark-read";
import { useNotificationSSE } from "../hooks/use-notification-sse";
import { useNotifications } from "../hooks/use-notifications";
import { useUnreadCount } from "../hooks/use-unread-count";
import { NotificationItem } from "./notification-item";

export function NotificationBell() {
  const t = useTranslations("notifications");
  const router = useRouter();
  const { data: unreadData } = useUnreadCount();
  const { data: notificationsData } = useNotifications({ size: 5 });
  const markRead = useMarkReadMutation();
  const markAllRead = useMarkAllReadMutation();

  useNotificationSSE();

  const unreadCount = unreadData?.count ?? 0;
  const notifications = notificationsData?.content ?? [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3">
          <h4 className="text-sm font-semibold">{t("title")}</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()}>
              {t("markAllRead")}
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-80 overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("empty")}</p>
          ) : (
            <div className="space-y-1">
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={(id) => markRead.mutate(id)}
                />
              ))}
            </div>
          )}
        </div>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full"
            size="sm"
            onClick={() => router.push("/notifications")}
          >
            {t("viewAll")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

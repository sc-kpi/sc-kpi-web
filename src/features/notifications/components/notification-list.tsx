"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useMarkAllReadMutation, useMarkReadMutation } from "../hooks/use-mark-read";
import { useNotifications } from "../hooks/use-notifications";
import type { NotificationCategory, NotificationFilterParams } from "../types";
import { NotificationItem } from "./notification-item";

export function NotificationList() {
  const t = useTranslations("notifications");
  const [filters, setFilters] = useState<NotificationFilterParams>({ page: 0, size: 20 });
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data, isLoading } = useNotifications(filters);
  const markRead = useMarkReadMutation();
  const markAllRead = useMarkAllReadMutation();

  const categories: { value: string; label: string }[] = [
    { value: "all", label: t("filters.all") },
    { value: "SECURITY", label: t("categories.SECURITY") },
    { value: "ADMIN", label: t("categories.ADMIN") },
    { value: "SYSTEM", label: t("categories.SYSTEM") },
    { value: "FEATURE_FLAG", label: t("categories.FEATURE_FLAG") },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilters((prev) => ({
      ...prev,
      category: value === "all" ? undefined : (value as NotificationCategory),
      page: 0,
    }));
  };

  const notifications = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = filters.page ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
        <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>
          {t("markAllRead")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <Button
          variant={filters.read === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => setFilters((prev) => ({ ...prev, read: undefined, page: 0 }))}
        >
          {t("filters.all")}
        </Button>
        <Button
          variant={filters.read === false ? "default" : "outline"}
          size="sm"
          onClick={() => setFilters((prev) => ({ ...prev, read: false, page: 0 }))}
        >
          {t("filters.unread")}
        </Button>
        <Button
          variant={filters.read === true ? "default" : "outline"}
          size="sm"
          onClick={() => setFilters((prev) => ({ ...prev, read: true, page: 0 }))}
        >
          {t("filters.read")}
        </Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">{t("loading")}</p>
      ) : notifications.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={(id) => markRead.mutate(id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => setFilters((prev) => ({ ...prev, page: currentPage - 1 }))}
          >
            {t("pagination.previous")}
          </Button>
          <span className="flex items-center text-muted-foreground text-sm">
            {t("pagination.page", { current: currentPage + 1, total: totalPages })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: currentPage + 1 }))}
          >
            {t("pagination.next")}
          </Button>
        </div>
      )}
    </div>
  );
}

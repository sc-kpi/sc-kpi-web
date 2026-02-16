"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAdminNotifications, useCleanupMutation } from "../../hooks/use-admin-notifications";
import type { NotificationFilterParams } from "../../types";
import { NotificationItem } from "../notification-item";

export function NotificationAdminList() {
  const t = useTranslations("notifications.admin");
  const [filters, setFilters] = useState<NotificationFilterParams & { search?: string }>({
    page: 0,
    size: 20,
  });
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminNotifications(filters);
  const cleanupMutation = useCleanupMutation();

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search, page: 0 }));
  };

  const notifications = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = filters.page ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-xs"
        />
        <Button variant="outline" size="sm" onClick={handleSearch}>
          {t("apply")}
        </Button>
        <div className="ml-auto">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => cleanupMutation.mutate(90)}
            disabled={cleanupMutation.isPending}
          >
            {t("cleanup")}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">{t("loading")}</p>
      ) : notifications.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
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
            {t("previous")}
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: currentPage + 1 }))}
          >
            {t("next")}
          </Button>
        </div>
      )}
    </div>
  );
}

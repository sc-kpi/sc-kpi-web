"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useNotificationStats } from "../../hooks/use-admin-notifications";

export function NotificationStats() {
  const t = useTranslations("notifications.admin");
  const { data: stats, isLoading } = useNotificationStats();

  if (isLoading || !stats) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              {t("stats.total")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-2xl">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              {t("stats.last24h")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-2xl">{stats.last24h}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              {t("stats.readRate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-2xl">{stats.total > 0 ? "—" : "0%"}</p>
          </CardContent>
        </Card>
      </div>
      {Object.keys(stats.byCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">{t("stats.byCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{category}</span>
                  <span className="font-medium text-sm">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

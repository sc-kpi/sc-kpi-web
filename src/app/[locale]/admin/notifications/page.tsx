"use client";

import { useTranslations } from "next-intl";
import { NotificationAdminList } from "@/features/notifications/components/admin/notification-admin-list";
import { NotificationBroadcastForm } from "@/features/notifications/components/admin/notification-broadcast-form";
import { NotificationStats } from "@/features/notifications/components/admin/notification-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export default function AdminNotificationsPage() {
  const t = useTranslations("notifications.admin");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">{t("tabs.list")}</TabsTrigger>
          <TabsTrigger value="broadcast">{t("tabs.broadcast")}</TabsTrigger>
          <TabsTrigger value="stats">{t("tabs.stats")}</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <NotificationAdminList />
        </TabsContent>
        <TabsContent value="broadcast">
          <NotificationBroadcastForm />
        </TabsContent>
        <TabsContent value="stats">
          <NotificationStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}

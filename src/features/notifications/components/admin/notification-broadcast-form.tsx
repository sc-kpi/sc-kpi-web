"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useBroadcastMutation } from "../../hooks/use-admin-notifications";
import type { NotificationCategory } from "../../types";

export function NotificationBroadcastForm() {
  const t = useTranslations("notifications.admin");
  const broadcastMutation = useBroadcastMutation();
  const [titleKey, setTitleKey] = useState("");
  const [bodyKey, setBodyKey] = useState("");
  const [category, setCategory] = useState<NotificationCategory>("SYSTEM");
  const [targetTier, setTargetTier] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastMutation.mutate(
      {
        titleKey,
        bodyKey,
        category,
        targetTier: targetTier || undefined,
      },
      {
        onSuccess: () => {
          setTitleKey("");
          setBodyKey("");
          setTargetTier("");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("broadcast.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titleKey">{t("broadcast.titleKey")}</Label>
            <Input
              id="titleKey"
              value={titleKey}
              onChange={(e) => setTitleKey(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyKey">{t("broadcast.bodyKey")}</Label>
            <Input
              id="bodyKey"
              value={bodyKey}
              onChange={(e) => setBodyKey(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">{t("broadcast.category")}</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as NotificationCategory)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="SYSTEM">SYSTEM</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SECURITY">SECURITY</option>
              <option value="FEATURE_FLAG">FEATURE_FLAG</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetTier">{t("broadcast.targetTier")}</Label>
            <select
              id="targetTier"
              value={targetTier}
              onChange={(e) => setTargetTier(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">{t("broadcast.allUsers")}</option>
              <option value="BASIC">BASIC</option>
              <option value="INTERNAL">INTERNAL</option>
              <option value="ADVANCED">ADVANCED</option>
              <option value="SENIOR">SENIOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <Button type="submit" disabled={broadcastMutation.isPending}>
            {broadcastMutation.isPending ? t("broadcast.sending") : t("broadcast.send")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

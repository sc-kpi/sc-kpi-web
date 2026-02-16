"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Switch } from "@/shared/ui/switch";
import {
  useNotificationPreferences,
  useUpdatePreferencesMutation,
} from "../hooks/use-notification-preferences";
import type { NotificationPreferenceDto } from "../types";

const CATEGORIES = ["SECURITY", "ADMIN", "SYSTEM", "FEATURE_FLAG"] as const;
const CHANNELS = ["IN_APP", "EMAIL"] as const;

export function NotificationPreferencesForm() {
  const t = useTranslations("notifications");
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updateMutation = useUpdatePreferencesMutation();
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferenceDto[]>([]);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const isEnabled = (category: string, channel: string) =>
    localPrefs.find((p) => p.category === category && p.channel === channel)?.enabled ?? true;

  const togglePref = (category: string, channel: string) => {
    setLocalPrefs((prev) =>
      prev.map((p) =>
        p.category === category && p.channel === channel ? { ...p, enabled: !p.enabled } : p,
      ),
    );
  };

  const handleSave = () => {
    updateMutation.mutate({
      preferences: localPrefs.map((p) => ({
        category: p.category,
        channel: p.channel,
        enabled: p.enabled,
      })),
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("preferences.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium">{t("preferences.category")}</th>
                {CHANNELS.map((ch) => (
                  <th key={ch} className="pb-2 text-center font-medium">
                    {t(`channels.${ch}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat) => (
                <tr key={cat} className="border-b last:border-0">
                  <td className="py-3">{t(`categories.${cat}`)}</td>
                  {CHANNELS.map((ch) => (
                    <td key={ch} className="py-3 text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={isEnabled(cat, ch)}
                          onCheckedChange={() => togglePref(cat, ch)}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? t("preferences.saving") : t("preferences.save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

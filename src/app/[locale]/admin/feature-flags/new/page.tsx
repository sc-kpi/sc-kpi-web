"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useCreateFeatureFlagMutation } from "@/features/feature-flags/hooks";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export default function AdminCreateFeatureFlagPage() {
  const t = useTranslations("admin.featureFlags");
  const tc = useTranslations("common");
  const router = useRouter();
  const createMutation = useCreateFeatureFlagMutation();

  const [form, setForm] = useState({
    key: "",
    name: "",
    description: "",
    enabled: true,
    environment: "",
    rolloutPercentage: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">{t("createFlag")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("flagDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate(form, {
                onSuccess: () => router.push("/admin/feature-flags"),
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="key">{t("key")}</Label>
              <Input
                id="key"
                placeholder="feature.name"
                pattern="^[a-z][a-z0-9.\-]*$"
                value={form.key}
                onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                required
              />
              <p className="text-muted-foreground text-xs">{t("keyHint")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="enabled">{t("enabled")}</Label>
              <input
                id="enabled"
                type="checkbox"
                className="h-4 w-4"
                checked={form.enabled}
                onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="environment">{t("environment")}</Label>
              <select
                id="environment"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.environment}
                onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value }))}
              >
                <option value="">{t("allEnvironments")}</option>
                <option value="dev">Development</option>
                <option value="staging">Staging</option>
                <option value="prod">Production</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollout">
                {t("rollout")}: {form.rolloutPercentage}%
              </Label>
              <input
                id="rollout"
                type="range"
                min="0"
                max="100"
                className="w-full"
                value={form.rolloutPercentage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rolloutPercentage: Number(e.target.value) }))
                }
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={createMutation.isPending}>
                {t("createFlag")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/feature-flags")}
              >
                {tc("cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

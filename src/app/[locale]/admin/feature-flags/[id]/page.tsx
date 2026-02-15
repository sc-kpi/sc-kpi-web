"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  useAddOverrideMutation,
  useAdminFeatureFlag,
  useRemoveOverrideMutation,
  useUpdateFeatureFlagMutation,
} from "@/features/feature-flags/hooks";
import type { CreateOverrideRequest } from "@/features/feature-flags/types";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export default function AdminFeatureFlagDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const t = useTranslations("admin.featureFlags");
  const tc = useTranslations("common");
  const router = useRouter();

  const { data: flag, isLoading } = useAdminFeatureFlag(id);
  const updateMutation = useUpdateFeatureFlagMutation(id);
  const addOverrideMutation = useAddOverrideMutation(id);
  const removeOverrideMutation = useRemoveOverrideMutation(id);
  const [overrideForm, setOverrideForm] = useState<CreateOverrideRequest>({
    overrideType: "TIER",
    tierLevel: 1,
    enabled: true,
  });

  if (isLoading) {
    return <p>{tc("loading")}</p>;
  }

  if (!flag) {
    return <p>{tc("notFound")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{t("editFlag")}</h1>
        <Button variant="outline" onClick={() => router.push("/admin/feature-flags")}>
          {t("backToList")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t("flagDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateMutation.mutate({
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  enabled: formData.get("enabled") === "on",
                  environment: (formData.get("environment") as string) || undefined,
                  rolloutPercentage: Number(formData.get("rolloutPercentage")),
                });
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="key">{t("key")}</Label>
                <Input id="key" value={flag.key} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" name="name" defaultValue={flag.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("description")}</Label>
                <textarea
                  id="description"
                  name="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue={flag.description ?? ""}
                />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="enabled">{t("enabled")}</Label>
                <input
                  id="enabled"
                  name="enabled"
                  type="checkbox"
                  className="h-4 w-4"
                  defaultChecked={flag.enabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">{t("environment")}</Label>
                <select
                  id="environment"
                  name="environment"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  defaultValue={flag.environment ?? ""}
                >
                  <option value="">{t("allEnvironments")}</option>
                  <option value="dev">Development</option>
                  <option value="staging">Staging</option>
                  <option value="prod">Production</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rolloutPercentage">{t("rollout")}</Label>
                <Input
                  id="rolloutPercentage"
                  name="rolloutPercentage"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={flag.rolloutPercentage}
                />
              </div>
              <Button type="submit" disabled={updateMutation.isPending}>
                {tc("save")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Overrides */}
        <Card>
          <CardHeader>
            <CardTitle>{t("overrides")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {flag.overrides.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t("noOverrides")}</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 font-medium">{t("type")}</th>
                      <th className="px-3 py-2 font-medium">{t("target")}</th>
                      <th className="px-3 py-2 font-medium">{t("enabled")}</th>
                      <th className="px-3 py-2 font-medium">{tc("actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {flag.overrides.map((override) => (
                      <tr key={override.id}>
                        <td className="px-3 py-2">{override.overrideType}</td>
                        <td className="px-3 py-2 font-mono text-xs">
                          {override.overrideType === "TIER"
                            ? `Tier ${override.tierLevel}`
                            : override.userId}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${
                              override.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {override.enabled ? t("enabled") : t("disabled")}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeOverrideMutation.mutate(override.id)}
                            disabled={removeOverrideMutation.isPending}
                          >
                            {tc("delete")}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <form
              className="flex flex-wrap items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                addOverrideMutation.mutate(overrideForm);
              }}
            >
              <div className="space-y-1">
                <Label htmlFor="overrideType">{t("type")}</Label>
                <select
                  id="overrideType"
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={overrideForm.overrideType}
                  onChange={(e) =>
                    setOverrideForm((f) => ({
                      ...f,
                      overrideType: e.target.value as "TIER" | "USER",
                      tierLevel: e.target.value === "TIER" ? 1 : undefined,
                      userId: e.target.value === "USER" ? "" : undefined,
                    }))
                  }
                >
                  <option value="TIER">Tier</option>
                  <option value="USER">User</option>
                </select>
              </div>
              {overrideForm.overrideType === "TIER" ? (
                <div className="space-y-1">
                  <Label htmlFor="tierLevel">Tier Level</Label>
                  <Input
                    id="tierLevel"
                    type="number"
                    min="0"
                    max="5"
                    className="w-20"
                    value={overrideForm.tierLevel ?? 1}
                    onChange={(e) =>
                      setOverrideForm((f) => ({ ...f, tierLevel: Number(e.target.value) }))
                    }
                  />
                </div>
              ) : (
                <div className="flex-1 space-y-1">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="UUID"
                    value={overrideForm.userId ?? ""}
                    onChange={(e) => setOverrideForm((f) => ({ ...f, userId: e.target.value }))}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Label htmlFor="overrideEnabled">{t("enabled")}</Label>
                <input
                  id="overrideEnabled"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={overrideForm.enabled}
                  onChange={(e) => setOverrideForm((f) => ({ ...f, enabled: e.target.checked }))}
                />
              </div>
              <Button type="submit" size="sm" disabled={addOverrideMutation.isPending}>
                {t("addOverride")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Link */}
      <Card>
        <CardHeader>
          <CardTitle>{t("auditLog")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            href={`/admin/audit-logs?entityType=FEATURE_FLAG&entityId=${id}` as "/admin/audit-logs"}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {t("auditLog")} →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

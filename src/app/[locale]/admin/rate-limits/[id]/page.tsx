"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAdminRateLimit, useUpdateRateLimitMutation } from "@/features/rate-limits/hooks";
import type { RateLimitScope } from "@/features/rate-limits/types";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const SCOPES: RateLimitScope[] = ["GLOBAL", "IP", "USER", "TIER"];

export default function AdminRateLimitDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const t = useTranslations("admin.rateLimits");
  const tc = useTranslations("common");
  const router = useRouter();

  const { data: rule, isLoading } = useAdminRateLimit(id);
  const updateMutation = useUpdateRateLimitMutation(id);

  if (isLoading) {
    return <p>{tc("loading")}</p>;
  }

  if (!rule) {
    return <p>{tc("notFound")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{t("editRule")}</h1>
        <Button variant="outline" onClick={() => router.push("/admin/rate-limits")}>
          {t("backToList")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("ruleDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateMutation.mutate({
                description: formData.get("description") as string,
                endpointPattern: formData.get("endpointPattern") as string,
                httpMethod: (formData.get("httpMethod") as string) || undefined,
                limitPerPeriod: Number(formData.get("limitPerPeriod")),
                periodSeconds: Number(formData.get("periodSeconds")),
                burstCapacity: Number(formData.get("burstCapacity")),
                scope: formData.get("scope") as RateLimitScope,
                targetTier: formData.get("targetTier") ? Number(formData.get("targetTier")) : null,
                targetUserId: (formData.get("targetUserId") as string) || null,
                timeWindowStart: (formData.get("timeWindowStart") as string) || null,
                timeWindowEnd: (formData.get("timeWindowEnd") as string) || null,
                priority: Number(formData.get("priority")),
                enabled: formData.get("enabled") === "on",
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" value={rule.name} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue={rule.description ?? ""}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="endpointPattern">{t("endpointPattern")}</Label>
                <Input
                  id="endpointPattern"
                  name="endpointPattern"
                  defaultValue={rule.endpointPattern}
                  required
                />
                <p className="text-muted-foreground text-xs">{t("endpointPatternHint")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="httpMethod">{t("httpMethod")}</Label>
                <select
                  id="httpMethod"
                  name="httpMethod"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  defaultValue={rule.httpMethod ?? ""}
                >
                  <option value="">{t("anyMethod")}</option>
                  {HTTP_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="limitPerPeriod">{t("limitPerPeriod")}</Label>
                <Input
                  id="limitPerPeriod"
                  name="limitPerPeriod"
                  type="number"
                  min="1"
                  defaultValue={rule.limitPerPeriod}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodSeconds">{t("periodSeconds")}</Label>
                <Input
                  id="periodSeconds"
                  name="periodSeconds"
                  type="number"
                  min="1"
                  defaultValue={rule.periodSeconds}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="burstCapacity">{t("burstCapacity")}</Label>
                <Input
                  id="burstCapacity"
                  name="burstCapacity"
                  type="number"
                  min="1"
                  defaultValue={rule.burstCapacity}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scope">{t("scope")}</Label>
                <select
                  id="scope"
                  name="scope"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  defaultValue={rule.scope}
                >
                  {SCOPES.map((s) => (
                    <option key={s} value={s}>
                      {t(`scopes.${s}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">{t("priority")}</Label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min="0"
                  defaultValue={rule.priority}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetTier">{t("targetTier")}</Label>
                <Input
                  id="targetTier"
                  name="targetTier"
                  type="number"
                  min="0"
                  max="5"
                  defaultValue={rule.targetTier ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetUserId">{t("targetUserId")}</Label>
                <Input
                  id="targetUserId"
                  name="targetUserId"
                  placeholder="UUID"
                  defaultValue={rule.targetUserId ?? ""}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeWindowStart">{t("timeWindowStart")}</Label>
                <Input
                  id="timeWindowStart"
                  name="timeWindowStart"
                  type="time"
                  defaultValue={rule.timeWindowStart ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeWindowEnd">{t("timeWindowEnd")}</Label>
                <Input
                  id="timeWindowEnd"
                  name="timeWindowEnd"
                  type="time"
                  defaultValue={rule.timeWindowEnd ?? ""}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="enabled">{t("enabled")}</Label>
              <input
                id="enabled"
                name="enabled"
                type="checkbox"
                className="h-4 w-4"
                defaultChecked={rule.enabled}
              />
            </div>

            <Button type="submit" disabled={updateMutation.isPending}>
              {tc("save")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("auditLog")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            href={
              `/admin/audit-logs?entityType=RATE_LIMIT_RULE&entityId=${id}` as "/admin/audit-logs"
            }
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {t("auditLog")} →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

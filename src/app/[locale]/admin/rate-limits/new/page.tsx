"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useCreateRateLimitMutation } from "@/features/rate-limits/hooks";
import type { CreateRateLimitRuleRequest, RateLimitScope } from "@/features/rate-limits/types";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const SCOPES: RateLimitScope[] = ["GLOBAL", "IP", "USER", "TIER"];

export default function AdminCreateRateLimitPage() {
  const t = useTranslations("admin.rateLimits");
  const tc = useTranslations("common");
  const router = useRouter();
  const createMutation = useCreateRateLimitMutation();

  const [form, setForm] = useState<CreateRateLimitRuleRequest>({
    name: "",
    description: "",
    endpointPattern: "",
    httpMethod: "",
    limitPerPeriod: 60,
    periodSeconds: 60,
    burstCapacity: 90,
    scope: "IP",
    targetTier: null,
    targetUserId: null,
    timeWindowStart: null,
    timeWindowEnd: null,
    priority: 1,
    enabled: true,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">{t("createRule")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("ruleDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate(
                {
                  ...form,
                  httpMethod: form.httpMethod || "",
                },
                {
                  onSuccess: () => router.push("/admin/rate-limits"),
                },
              );
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                placeholder="auth.login.ip"
                pattern="^[a-z][a-z0-9.\-]*$"
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="endpointPattern">{t("endpointPattern")}</Label>
                <Input
                  id="endpointPattern"
                  placeholder="/api/v1/auth/**"
                  value={form.endpointPattern}
                  onChange={(e) => setForm((f) => ({ ...f, endpointPattern: e.target.value }))}
                  required
                />
                <p className="text-muted-foreground text-xs">{t("endpointPatternHint")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="httpMethod">{t("httpMethod")}</Label>
                <select
                  id="httpMethod"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.httpMethod}
                  onChange={(e) => setForm((f) => ({ ...f, httpMethod: e.target.value }))}
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
                  type="number"
                  min="1"
                  value={form.limitPerPeriod}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, limitPerPeriod: Number(e.target.value) }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodSeconds">{t("periodSeconds")}</Label>
                <Input
                  id="periodSeconds"
                  type="number"
                  min="1"
                  value={form.periodSeconds}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, periodSeconds: Number(e.target.value) }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="burstCapacity">{t("burstCapacity")}</Label>
                <Input
                  id="burstCapacity"
                  type="number"
                  min="1"
                  value={form.burstCapacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, burstCapacity: Number(e.target.value) }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scope">{t("scope")}</Label>
                <select
                  id="scope"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.scope}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      scope: e.target.value as RateLimitScope,
                      targetTier: null,
                      targetUserId: null,
                    }))
                  }
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
                  type="number"
                  min="0"
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>

            {form.scope === "TIER" && (
              <div className="space-y-2">
                <Label htmlFor="targetTier">{t("targetTier")}</Label>
                <Input
                  id="targetTier"
                  type="number"
                  min="0"
                  max="5"
                  value={form.targetTier ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      targetTier: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                />
              </div>
            )}

            {form.scope === "USER" && (
              <div className="space-y-2">
                <Label htmlFor="targetUserId">{t("targetUserId")}</Label>
                <Input
                  id="targetUserId"
                  placeholder="UUID"
                  value={form.targetUserId ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      targetUserId: e.target.value || null,
                    }))
                  }
                />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeWindowStart">{t("timeWindowStart")}</Label>
                <Input
                  id="timeWindowStart"
                  type="time"
                  value={form.timeWindowStart ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      timeWindowStart: e.target.value || null,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeWindowEnd">{t("timeWindowEnd")}</Label>
                <Input
                  id="timeWindowEnd"
                  type="time"
                  value={form.timeWindowEnd ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      timeWindowEnd: e.target.value || null,
                    }))
                  }
                />
              </div>
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

            <div className="flex gap-3">
              <Button type="submit" disabled={createMutation.isPending}>
                {t("createRule")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/rate-limits")}
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

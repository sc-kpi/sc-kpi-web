"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  useAdminRateLimits,
  useDeleteRateLimitMutation,
  useToggleRateLimitMutation,
} from "@/features/rate-limits/hooks";
import type { RateLimitRuleDto } from "@/features/rate-limits/types";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";

function EnabledBadge({ enabled, t }: { enabled: boolean; t: (key: string) => string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${
        enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {enabled ? t("enabled") : t("disabled")}
    </span>
  );
}

function ScopeBadge({ scope, t }: { scope: string; t: (key: string) => string }) {
  const colors: Record<string, string> = {
    GLOBAL: "bg-purple-100 text-purple-700",
    IP: "bg-blue-100 text-blue-700",
    USER: "bg-amber-100 text-amber-700",
    TIER: "bg-cyan-100 text-cyan-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${colors[scope] || "bg-gray-100 text-gray-700"}`}
    >
      {t(`scopes.${scope}`)}
    </span>
  );
}

function ToggleButton({ rule }: { rule: RateLimitRuleDto }) {
  const toggleMutation = useToggleRateLimitMutation(rule.id);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => toggleMutation.mutate({ enabled: !rule.enabled })}
      disabled={toggleMutation.isPending}
    >
      {rule.enabled ? "Off" : "On"}
    </Button>
  );
}

export default function AdminRateLimitsPage() {
  const t = useTranslations("admin.rateLimits");
  const tc = useTranslations("common");
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAdminRateLimits(page);
  const deleteMutation = useDeleteRateLimitMutation();

  if (isLoading) {
    return <p>{tc("loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
        <Link href="/admin/rate-limits/new">
          <Button>{t("createRule")}</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">{t("name")}</th>
              <th className="px-4 py-3 font-medium">{t("endpointPattern")}</th>
              <th className="px-4 py-3 font-medium">{t("scope")}</th>
              <th className="px-4 py-3 font-medium">{t("limitPerPeriod")}</th>
              <th className="px-4 py-3 font-medium">{t("burstCapacity")}</th>
              <th className="px-4 py-3 font-medium">{t("priority")}</th>
              <th className="px-4 py-3 font-medium">{t("status")}</th>
              <th className="px-4 py-3 font-medium">{tc("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.content.map((rule) => (
              <tr key={rule.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{rule.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{rule.endpointPattern}</td>
                <td className="px-4 py-3">
                  <ScopeBadge scope={rule.scope} t={t} />
                </td>
                <td className="px-4 py-3">
                  {rule.limitPerPeriod}/{rule.periodSeconds}s
                </td>
                <td className="px-4 py-3">{rule.burstCapacity}</td>
                <td className="px-4 py-3">{rule.priority}</td>
                <td className="px-4 py-3">
                  <EnabledBadge enabled={rule.enabled} t={t} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <ToggleButton rule={rule} />
                    <Link href={`/admin/rate-limits/${rule.id}`}>
                      <Button variant="outline" size="sm">
                        {t("edit")}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(t("confirmDelete"))) {
                          deleteMutation.mutate(rule.id);
                        }
                      }}
                    >
                      {tc("delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.first}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-muted-foreground text-sm">
            {page + 1} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={data.last}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

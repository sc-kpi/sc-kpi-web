"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  useAdminFeatureFlags,
  useDeleteFeatureFlagMutation,
  useToggleFeatureFlagMutation,
} from "@/features/feature-flags/hooks";
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

function ToggleButton({ id, enabled }: { id: string; enabled: boolean }) {
  const toggleMutation = useToggleFeatureFlagMutation(id);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => toggleMutation.mutate({ enabled: !enabled })}
      disabled={toggleMutation.isPending}
    >
      {enabled ? "Off" : "On"}
    </Button>
  );
}

export default function AdminFeatureFlagsPage() {
  const t = useTranslations("admin.featureFlags");
  const tc = useTranslations("common");
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAdminFeatureFlags(page);
  const deleteMutation = useDeleteFeatureFlagMutation();

  if (isLoading) {
    return <p>{tc("loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
        <Link href="/admin/feature-flags/new">
          <Button>{t("createFlag")}</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">{t("key")}</th>
              <th className="px-4 py-3 font-medium">{t("name")}</th>
              <th className="px-4 py-3 font-medium">{t("status")}</th>
              <th className="px-4 py-3 font-medium">{t("environment")}</th>
              <th className="px-4 py-3 font-medium">{t("rollout")}</th>
              <th className="px-4 py-3 font-medium">{tc("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.content.map((flag) => (
              <tr key={flag.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{flag.key}</td>
                <td className="px-4 py-3">{flag.name}</td>
                <td className="px-4 py-3">
                  <EnabledBadge enabled={flag.enabled} t={t} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{flag.environment || "—"}</td>
                <td className="px-4 py-3">{flag.rolloutPercentage}%</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <ToggleButton id={flag.id} enabled={flag.enabled} />
                    <Link href={`/admin/feature-flags/${flag.id}`}>
                      <Button variant="outline" size="sm">
                        {t("edit")}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(t("confirmDelete"))) {
                          deleteMutation.mutate(flag.id);
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

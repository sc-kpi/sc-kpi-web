"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { downloadAuditCsv } from "@/features/audit/api";
import { useAuditLogs } from "@/features/audit/hooks";
import type { AuditFilterParams } from "@/features/audit/types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

const ACTION_COLORS: Record<string, string> = {
  CREATED: "bg-green-100 text-green-700",
  UPDATED: "bg-blue-100 text-blue-700",
  DELETED: "bg-red-100 text-red-700",
  TOGGLED: "bg-purple-100 text-purple-700",
  BULK_TOGGLED: "bg-purple-100 text-purple-700",
  LOGIN: "bg-green-100 text-green-700",
  LOGIN_FAILED: "bg-yellow-100 text-yellow-700",
  LOGOUT: "bg-gray-100 text-gray-700",
  REGISTER: "bg-green-100 text-green-700",
  PASSWORD_CHANGED: "bg-blue-100 text-blue-700",
  PASSWORD_RESET_REQUESTED: "bg-yellow-100 text-yellow-700",
  PASSWORD_RESET_COMPLETED: "bg-blue-100 text-blue-700",
  OAUTH_LOGIN: "bg-green-100 text-green-700",
  OAUTH_LINKED: "bg-blue-100 text-blue-700",
  AUDIT_EXPORTED: "bg-gray-100 text-gray-700",
};

const ENTITY_TYPES = ["USER", "FEATURE_FLAG", "AUTH"];
const ACTIONS = [
  "CREATED",
  "UPDATED",
  "DELETED",
  "TOGGLED",
  "BULK_TOGGLED",
  "LOGIN",
  "LOGIN_FAILED",
  "LOGOUT",
  "REGISTER",
  "PASSWORD_CHANGED",
  "OAUTH_LOGIN",
  "OAUTH_LINKED",
];
const MODULES = ["auth", "user", "feature-flag", "audit"];

export default function AdminAuditLogsPage() {
  const t = useTranslations("admin.auditLogs");
  const tc = useTranslations("common");

  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<AuditFilterParams>({});
  const [formState, setFormState] = useState<AuditFilterParams>({});

  const { data, isLoading } = useAuditLogs({ ...filters, page, size: 20 });

  const handleApply = () => {
    setPage(0);
    setFilters({ ...formState });
  };

  const handleReset = () => {
    setPage(0);
    setFormState({});
    setFilters({});
  };

  const handleExport = () => {
    downloadAuditCsv(filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          {t("export")}
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
        <div className="space-y-1">
          <label htmlFor="entityType" className="font-medium text-xs">
            {t("entityType")}
          </label>
          <select
            id="entityType"
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={formState.entityType ?? ""}
            onChange={(e) =>
              setFormState((s) => ({ ...s, entityType: e.target.value || undefined }))
            }
          >
            <option value="">{t("allEntityTypes")}</option>
            {ENTITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="action" className="font-medium text-xs">
            {t("action")}
          </label>
          <select
            id="action"
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={formState.action ?? ""}
            onChange={(e) => setFormState((s) => ({ ...s, action: e.target.value || undefined }))}
          >
            <option value="">{t("allActions")}</option>
            {ACTIONS.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="sourceModule" className="font-medium text-xs">
            {t("sourceModule")}
          </label>
          <select
            id="sourceModule"
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={formState.sourceModule ?? ""}
            onChange={(e) =>
              setFormState((s) => ({ ...s, sourceModule: e.target.value || undefined }))
            }
          >
            <option value="">{t("allModules")}</option>
            {MODULES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="dateFrom" className="font-medium text-xs">
            {t("dateFrom")}
          </label>
          <Input
            id="dateFrom"
            type="datetime-local"
            className="w-48"
            value={formState.from ?? ""}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                from: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              }))
            }
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="dateTo" className="font-medium text-xs">
            {t("dateTo")}
          </label>
          <Input
            id="dateTo"
            type="datetime-local"
            className="w-48"
            value={formState.to ?? ""}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                to: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              }))
            }
          />
        </div>

        <div className="min-w-[180px] flex-1 space-y-1">
          <label htmlFor="search" className="font-medium text-xs">
            {t("search")}
          </label>
          <Input
            id="search"
            placeholder={t("search")}
            value={formState.search ?? ""}
            onChange={(e) => setFormState((s) => ({ ...s, search: e.target.value || undefined }))}
          />
        </div>

        <Button onClick={handleApply}>{t("apply")}</Button>
        <Button variant="outline" onClick={handleReset}>
          {t("reset")}
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>{tc("loading")}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-3 py-2 font-medium">{t("timestamp")}</th>
                <th className="px-3 py-2 font-medium">{t("actor")}</th>
                <th className="px-3 py-2 font-medium">{t("action")}</th>
                <th className="px-3 py-2 font-medium">{t("entityType")}</th>
                <th className="px-3 py-2 font-medium">{t("entity")}</th>
                <th className="px-3 py-2 font-medium">{t("field")}</th>
                <th className="px-3 py-2 font-medium">
                  {t("oldValue")} → {t("newValue")}
                </th>
                <th className="px-3 py-2 font-medium">{t("details")}</th>
                <th className="px-3 py-2 font-medium">{t("module")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.content.length ? (
                data.content.map((event) => (
                  <tr key={event.id} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-3 py-2 text-xs">
                      {new Date(event.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-xs">{event.actorEmail ?? "—"}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${ACTION_COLORS[event.action] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {event.action}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 font-medium text-xs">
                        {event.entityType}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2 text-xs">
                      {event.entityName ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">{event.fieldName ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">
                      {event.oldValue || event.newValue ? (
                        <>
                          <span className="text-muted-foreground">{event.oldValue ?? "—"}</span>
                          {" → "}
                          <span>{event.newValue ?? "—"}</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2 text-muted-foreground text-xs">
                      {event.details ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">{event.sourceModule}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-muted-foreground text-sm">
                    {t("noEntries")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {t("title")} {data.page * data.size + 1}–
            {Math.min((data.page + 1) * data.size, data.totalElements)} / {data.totalElements}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.first}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.last}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

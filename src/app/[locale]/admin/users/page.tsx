"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDeleteUserMutation, useUsers } from "@/features/user/hooks";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";

function TierBadge({ tier, t }: { tier: number; t: (key: string) => string }) {
  const colors: Record<number, string> = {
    0: "bg-gray-100 text-gray-700",
    1: "bg-blue-100 text-blue-700",
    2: "bg-green-100 text-green-700",
    3: "bg-yellow-100 text-yellow-700",
    4: "bg-purple-100 text-purple-700",
    5: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors[tier] ?? colors[0]}`}
    >
      {t(`tierNames.${tier}`)}
    </span>
  );
}

function StatusBadge({ active, t }: { active: boolean; t: (key: string) => string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {active ? t("active") : t("inactive")}
    </span>
  );
}

export default function AdminUsersPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const [page, setPage] = useState(0);
  const { data, isLoading } = useUsers(page);
  const deleteMutation = useDeleteUserMutation();

  if (isLoading) {
    return <p>{tc("loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{t("users")}</h1>
        <Link href="/admin/users/new">
          <Button>{t("createUser")}</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">{t("users")}</th>
              <th className="px-4 py-3 font-medium">{t("tier")}</th>
              <th className="px-4 py-3 font-medium">{t("status")}</th>
              <th className="px-4 py-3 font-medium">{tc("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.content.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TierBadge tier={user.capabilityTier} t={t} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge active={user.active} t={t} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="outline" size="sm">
                        {t("editUser")}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(t("confirmDelete"))) {
                          deleteMutation.mutate(user.id);
                        }
                      }}
                    >
                      {t("deleteUser")}
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
          <span className="flex items-center px-3 text-sm text-muted-foreground">
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

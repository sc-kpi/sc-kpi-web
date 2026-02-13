"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  useAssignPartnerMutation,
  useDeleteUserMutation,
  useRemovePartnerMutation,
  useUpdateStatusMutation,
  useUpdateTierMutation,
  useUpdateUserMutation,
  useUser,
} from "@/features/user/hooks";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const t = useTranslations("admin");
  const ta = useTranslations("auth");
  const tc = useTranslations("common");
  const router = useRouter();

  const { data: user, isLoading } = useUser(id);
  const updateMutation = useUpdateUserMutation(id);
  const tierMutation = useUpdateTierMutation(id);
  const statusMutation = useUpdateStatusMutation(id);
  const deleteMutation = useDeleteUserMutation();
  const assignPartnerMutation = useAssignPartnerMutation(id);
  const removePartnerMutation = useRemovePartnerMutation(id);

  const [profileForm, setProfileForm] = useState<{ firstName: string; lastName: string } | null>(
    null,
  );
  const [partnerForm, setPartnerForm] = useState({ partnerId: "", level: "basic" });

  if (isLoading) {
    return <p>{tc("loading")}</p>;
  }

  if (!user) {
    return <p>{tc("notFound")}</p>;
  }

  const editForm = profileForm ?? { firstName: user.firstName, lastName: user.lastName };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{t("userDetails")}</h1>
        <Button
          variant="outline"
          onClick={() => {
            if (confirm(t("confirmDelete"))) {
              deleteMutation.mutate(id, { onSuccess: () => router.push("/admin/users") });
            }
          }}
        >
          {t("deleteUser")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>{t("editUser")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate(editForm, { onSuccess: () => setProfileForm(null) });
              }}
            >
              <div className="space-y-2">
                <Label>{ta("email")}</Label>
                <Input value={user.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">{ta("firstName")}</Label>
                <Input
                  id="firstName"
                  value={editForm.firstName}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...(f ?? editForm), firstName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{ta("lastName")}</Label>
                <Input
                  id="lastName"
                  value={editForm.lastName}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...(f ?? editForm), lastName: e.target.value }))
                  }
                />
              </div>
              <Button type="submit" disabled={updateMutation.isPending}>
                {tc("save")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tier + Status */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("tier")} & {t("status")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tier">{t("tier")}</Label>
              <select
                id="tier"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={user.capabilityTier}
                onChange={(e) => tierMutation.mutate(Number(e.target.value))}
              >
                {[0, 1, 2, 3, 4, 5].map((tier) => (
                  <option key={tier} value={tier}>
                    {t(`tierNames.${tier}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{t("status")}</Label>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.active ? t("active") : t("inactive")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => statusMutation.mutate(!user.active)}
                  disabled={statusMutation.isPending}
                >
                  {user.active ? t("deactivate") : t("activate")}
                </Button>
              </div>
            </div>
            <div className="space-y-1 pt-2 text-sm text-muted-foreground">
              <p>
                {t("createdAt")}: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partner Roles */}
      <Card>
        <CardHeader>
          <CardTitle>{t("assignPartner")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.partnerRoles.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noPartnerRoles")}</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 font-medium">{t("partnerId")}</th>
                    <th className="px-4 py-2 font-medium">{t("partnerLevel")}</th>
                    <th className="px-4 py-2 font-medium">{t("assignedAt")}</th>
                    <th className="px-4 py-2 font-medium">{tc("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {user.partnerRoles.map((role) => (
                    <tr key={role.partnerId}>
                      <td className="px-4 py-2 font-mono text-xs">{role.partnerId}</td>
                      <td className="px-4 py-2">{role.level}</td>
                      <td className="px-4 py-2">
                        {new Date(role.assignedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePartnerMutation.mutate(role.partnerId)}
                          disabled={removePartnerMutation.isPending}
                        >
                          {t("removePartner")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <form
            className="flex items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!partnerForm.partnerId) return;
              assignPartnerMutation.mutate(partnerForm, {
                onSuccess: () => setPartnerForm({ partnerId: "", level: "basic" }),
              });
            }}
          >
            <div className="flex-1 space-y-1">
              <Label htmlFor="partnerId">{t("partnerId")}</Label>
              <Input
                id="partnerId"
                placeholder="UUID"
                value={partnerForm.partnerId}
                onChange={(e) => setPartnerForm((f) => ({ ...f, partnerId: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="partnerLevel">{t("partnerLevel")}</Label>
              <select
                id="partnerLevel"
                className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={partnerForm.level}
                onChange={(e) => setPartnerForm((f) => ({ ...f, level: e.target.value }))}
              >
                <option value="basic">Basic</option>
                <option value="documents">Documents</option>
                <option value="full">Full</option>
              </select>
            </div>
            <Button type="submit" disabled={assignPartnerMutation.isPending}>
              {t("assignPartner")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

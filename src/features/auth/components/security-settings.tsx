"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useTotpStatus } from "../hooks/use-totp";
import { TotpDisableForm } from "./totp-disable-form";
import { TotpSetupWizard } from "./totp-setup-wizard";

export function SecuritySettings() {
  const t = useTranslations("auth.twoFactor");
  const { data: status, isLoading } = useTotpStatus();
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <p className="font-medium text-sm">{t("authenticatorApp")}</p>
              <p className="text-muted-foreground text-sm">
                {status?.enabled ? t("enabled") : t("disabled")}
              </p>
              {status?.enabled && status.recoveryCodesRemaining > 0 && (
                <p className="text-muted-foreground text-xs">
                  {t("recoveryCodesRemaining", { count: status.recoveryCodesRemaining })}
                </p>
              )}
            </div>
            <div>
              {status?.enabled ? (
                <Button variant="destructive" size="sm" onClick={() => setShowDisable(true)}>
                  {t("disable")}
                </Button>
              ) : (
                <Button size="sm" onClick={() => setShowSetup(true)}>
                  {t("enable")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <TotpSetupWizard open={showSetup} onOpenChange={setShowSetup} />
      <TotpDisableForm open={showDisable} onOpenChange={setShowDisable} />
    </>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ApiError } from "@/shared/types/api";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useSetupTotp, useVerifySetup } from "../hooks/use-totp";
import { type TotpCodeFormData, totpCodeSchema } from "../lib/validation";
import type { TotpSetupResponse } from "../types";
import { BackupCodesDisplay } from "./backup-codes-display";

interface TotpSetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "qr" | "verify" | "codes";

export function TotpSetupWizard({ open, onOpenChange }: TotpSetupWizardProps) {
  const t = useTranslations("auth.twoFactor");
  const [step, setStep] = useState<Step>("qr");
  const [setupData, setSetupData] = useState<TotpSetupResponse | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const setupMutation = useSetupTotp();
  const verifyMutation = useVerifySetup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TotpCodeFormData>({
    resolver: zodResolver(totpCodeSchema),
  });

  async function handleStart() {
    setApiError(null);
    try {
      const data = await setupMutation.mutateAsync();
      setSetupData(data);
      setStep("qr");
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.detail ?? t("setupError"));
      } else {
        setApiError(t("setupError"));
      }
    }
  }

  async function onVerify(data: TotpCodeFormData) {
    setApiError(null);
    try {
      const result = await verifyMutation.mutateAsync({ code: data.code });
      setRecoveryCodes(result.codes);
      setStep("codes");
      toast.success(t("enabledSuccess"));
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.detail ?? t("verifyError"));
      } else {
        setApiError(t("verifyError"));
      }
    }
  }

  function handleDone() {
    setStep("qr");
    setSetupData(null);
    setRecoveryCodes([]);
    setApiError(null);
    reset();
    onOpenChange(false);
  }

  // Start setup when dialog opens
  if (open && !setupData && !setupMutation.isPending) {
    handleStart();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && step !== "codes") handleDone();
        else if (!isOpen && step === "codes") return; // Prevent closing during codes step
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("setupTitle")}</DialogTitle>
          <DialogDescription>
            {step === "qr" && t("setupStep1")}
            {step === "verify" && t("setupStep2")}
            {step === "codes" && t("setupStep3")}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div role="alert" className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {apiError}
          </div>
        )}

        {step === "qr" && setupData && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                data-testid="2fa-qr-code"
                src={setupData.qrCodeDataUri}
                alt="TOTP QR Code"
                className="h-[200px] w-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("manualEntryKey")}</Label>
              <code data-testid="2fa-secret-key" className="block break-all rounded-md bg-muted p-2 text-center font-mono text-sm">
                {setupData.manualEntryKey}
              </code>
            </div>
            <Button className="w-full" onClick={() => setStep("verify")}>
              {t("next")}
            </Button>
          </div>
        )}

        {step === "qr" && !setupData && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {step === "verify" && (
          <form onSubmit={handleSubmit(onVerify)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="setup-code">{t("codeLabel")}</Label>
              <Input
                id="setup-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                aria-invalid={!!errors.code}
                {...register("code")}
              />
              {errors.code && <p className="text-destructive text-sm">{errors.code.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? t("verifying") : t("verifyAndEnable")}
            </Button>
          </form>
        )}

        {step === "codes" && <BackupCodesDisplay codes={recoveryCodes} onDone={handleDone} />}
      </DialogContent>
    </Dialog>
  );
}

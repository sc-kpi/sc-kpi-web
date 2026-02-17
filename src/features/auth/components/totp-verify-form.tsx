"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ApiError } from "@/shared/types/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { verifyLoginTotp } from "../api";
import { type TotpCodeFormData, totpCodeSchema } from "../lib/validation";

export function TotpVerifyForm() {
  const t = useTranslations("auth.twoFactor");
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TotpCodeFormData>({
    resolver: zodResolver(totpCodeSchema),
  });

  async function onSubmit(data: TotpCodeFormData) {
    setApiError(null);
    setIsSubmitting(true);
    try {
      await verifyLoginTotp({ code: data.code });
      router.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.detail ?? t("verifyError"));
      } else {
        setApiError(t("verifyError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && (
        <div role="alert" className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {apiError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="code">{useRecoveryCode ? t("recoveryCodeLabel") : t("codeLabel")}</Label>
        <Input
          id="code"
          type="text"
          inputMode={useRecoveryCode ? "text" : "numeric"}
          autoComplete="one-time-code"
          placeholder={useRecoveryCode ? "XXXX-XXXX" : "000000"}
          aria-invalid={!!errors.code}
          {...register("code")}
        />
        {errors.code && <p className="text-destructive text-sm">{errors.code.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("verifying") : t("verify")}
      </Button>

      <button
        type="button"
        className="w-full text-center text-muted-foreground text-sm underline-offset-4 hover:text-primary hover:underline"
        onClick={() => setUseRecoveryCode(!useRecoveryCode)}
      >
        {useRecoveryCode ? t("useAuthenticatorCode") : t("useRecoveryCode")}
      </button>
    </form>
  );
}

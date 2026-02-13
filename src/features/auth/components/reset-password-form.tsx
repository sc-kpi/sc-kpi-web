"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ApiError } from "@/shared/types/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { resetPassword } from "../api";
import { type ResetPasswordFormData, resetPasswordSchema } from "../lib/validation";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) return;
    setApiError(null);
    setIsSubmitting(true);
    try {
      await resetPassword(token, data.newPassword);
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.detail ?? t("resetPasswordError"));
      } else {
        setApiError(t("resetPasswordError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="space-y-4">
        <div role="alert" className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {t("resetPasswordError")}
        </div>
        <p className="text-center text-muted-foreground text-sm">
          <Link href="/forgot-password" className="text-primary underline-offset-4 hover:underline">
            {t("forgotPassword")}
          </Link>
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-primary/10 p-3 text-sm">{t("resetPasswordSuccess")}</div>
        <p className="text-center text-muted-foreground text-sm">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && (
        <div role="alert" className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {apiError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="newPassword">{t("newPassword")}</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.newPassword}
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-destructive text-sm">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmNewPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("resetPasswordSubmitting") : t("resetPasswordSubmit")}
      </Button>
    </form>
  );
}

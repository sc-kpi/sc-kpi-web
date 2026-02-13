"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ApiError } from "@/shared/types/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { forgotPassword } from "../api";
import { type ForgotPasswordFormData, forgotPasswordSchema } from "../lib/validation";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setApiError(null);
    setIsSubmitting(true);
    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.detail ?? t("loginError"));
      } else {
        setApiError(t("loginError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-primary/10 p-3 text-sm">{t("forgotPasswordSuccess")}</div>
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
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("forgotPasswordSubmitting") : t("forgotPasswordSubmit")}
      </Button>

      <p className="text-center text-muted-foreground text-sm">
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}

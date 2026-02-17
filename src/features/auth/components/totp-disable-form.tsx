"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { useDisableTotp } from "../hooks/use-totp";
import { type TotpDisableFormData, totpDisableSchema } from "../lib/validation";

interface TotpDisableFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TotpDisableForm({ open, onOpenChange }: TotpDisableFormProps) {
  const t = useTranslations("auth.twoFactor");
  const [apiError, setApiError] = useState<string | null>(null);
  const disableMutation = useDisableTotp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TotpDisableFormData>({
    resolver: zodResolver(totpDisableSchema),
  });

  async function onSubmit(data: TotpDisableFormData) {
    setApiError(null);
    try {
      await disableMutation.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.detail ?? t("disableError"));
      } else {
        setApiError(t("disableError"));
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("disableTitle")}</DialogTitle>
          <DialogDescription>{t("disableDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div role="alert" className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
              {apiError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="disable-password">{t("passwordLabel")}</Label>
            <Input
              id="disable-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="disable-code">{t("codeLabel")}</Label>
            <Input
              id="disable-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              aria-invalid={!!errors.code}
              {...register("code")}
            />
            {errors.code && <p className="text-destructive text-sm">{errors.code.message}</p>}
          </div>

          <Button
            type="submit"
            variant="destructive"
            className="w-full"
            disabled={disableMutation.isPending}
          >
            {disableMutation.isPending ? t("disabling") : t("disable")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

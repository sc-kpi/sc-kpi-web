import { useTranslations } from "next-intl";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("forgotPasswordTitle")}</CardTitle>
        <CardDescription>{t("forgotPasswordDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}

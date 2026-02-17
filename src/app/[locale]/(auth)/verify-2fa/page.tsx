import { useTranslations } from "next-intl";
import { TotpVerifyForm } from "@/features/auth/components/totp-verify-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export default function Verify2faPage() {
  const t = useTranslations("auth.twoFactor");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("verifyTitle")}</CardTitle>
        <CardDescription>{t("verifyDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <TotpVerifyForm />
      </CardContent>
    </Card>
  );
}

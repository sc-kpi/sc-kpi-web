import { useTranslations } from "next-intl";
import { SecuritySettings } from "@/features/auth/components/security-settings";

export default function SecurityPage() {
  const t = useTranslations("auth.twoFactor");

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 font-bold text-2xl">{t("pageTitle")}</h1>
      <SecuritySettings />
    </main>
  );
}

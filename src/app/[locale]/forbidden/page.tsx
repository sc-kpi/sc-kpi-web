import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ForbiddenPage() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-bold text-6xl">403</h1>
        <p className="text-lg text-muted-foreground">{t("forbidden")}</p>
        <Link href="/" className="text-primary underline underline-offset-4 hover:text-primary/80">
          {t("backToHome")}
        </Link>
      </main>
    </div>
  );
}

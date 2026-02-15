"use client";

import { useTranslations } from "next-intl";
import { PermissionGuard } from "@/features/auth/components/permission-guard";
import { CAPABILITY_TIERS } from "@/features/auth/types";
import { Link, usePathname } from "@/i18n/navigation";

function AdminForbidden() {
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

function AdminNav() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/users" as const, label: t("users") },
    { href: "/admin/feature-flags" as const, label: t("featureFlags.title") },
    { href: "/admin/audit-logs" as const, label: t("auditLogs.title") },
  ];

  return (
    <nav className="flex gap-4 border-b px-6 py-3">
      <h2 className="font-semibold text-lg">{t("title")}</h2>
      <div className="flex gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              pathname.startsWith(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard requiredTier={CAPABILITY_TIERS.ADMIN} fallback={<AdminForbidden />}>
      <div className="min-h-screen">
        <AdminNav />
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </PermissionGuard>
  );
}

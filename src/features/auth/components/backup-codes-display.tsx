"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";

interface BackupCodesDisplayProps {
  codes: string[];
  onDone: () => void;
}

export function BackupCodesDisplay({ codes, onDone }: BackupCodesDisplayProps) {
  const t = useTranslations("auth.twoFactor");

  function handleCopyAll() {
    navigator.clipboard.writeText(codes.join("\n"));
  }

  function handleDownload() {
    const content = `SC-KPI Recovery Codes\n${"=".repeat(30)}\n\n${codes.join("\n")}\n\nStore these codes in a safe place.\nEach code can only be used once.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sc-kpi-recovery-codes.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-muted/50 p-4">
        <div className="grid grid-cols-2 gap-2">
          {codes.map((code) => (
            <code
              key={code}
              className="rounded bg-background px-2 py-1 text-center font-mono text-sm"
            >
              {code}
            </code>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
        {t("backupCodesWarning")}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={handleCopyAll}>
          {t("copyAll")}
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={handleDownload}>
          {t("download")}
        </Button>
      </div>

      <Button type="button" className="w-full" onClick={onDone}>
        {t("done")}
      </Button>
    </div>
  );
}

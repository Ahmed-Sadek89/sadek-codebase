"use client";

import { useTransition } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { usePathname, useRouter } from "../../../i18n/navigation";
import { isLocale } from "../../../i18n/config";
import { LANGUAGE_OPTIONS } from "../../../utils/constants";

export function LanguageSelect() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={locale}
      // Same page, new locale prefix: /en/dashboard -> /ar/dashboard.
      onValueChange={(next) => {
        if (!isLocale(next)) return;
        startTransition(() => router.replace(pathname, { locale: next }));
      }}
      disabled={isPending}
    >
      <SelectTrigger
        aria-label={t("languageSelectLabel")}
        className="sm:w-36 border-0"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_OPTIONS.map(({ value, label, flag }) => (
          <SelectItem key={value} value={value} lang={value}>
            {/* Decorative: the label already names the language. */}
            <Image
              src={flag}
              alt={value}
              width={20}
              height={15}
              priority
              className="h-3.75 w-5 shrink-0 rounded-xs object-cover ring-1 ring-border"
            />
            <span className="hidden sm:block">{label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

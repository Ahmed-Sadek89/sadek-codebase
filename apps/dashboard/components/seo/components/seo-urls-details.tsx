"use client";

import { useTranslations } from "next-intl";
import type { Seo } from "@repo/types/seo";
import { Languages, Link2 } from "@repo/ui/icons";

/** The canonical URL and hreflang alternates of one SEO version (same for every language tab). */
export function SeoUrlsDetails({ seo }: { seo: Seo }) {
  const t = useTranslations();

  return (
    <dl className="grid gap-4 rounded-xl border border-border p-4 text-sm sm:grid-cols-2">
      <div className="min-w-0 space-y-1">
        <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link2 className="size-3.5" aria-hidden />
          {t("seoFormCanonicalUrlLabel")}
        </dt>
        <dd dir="ltr" className="break-all text-start">
          {seo.canonicalUrl ? (
            <a
              href={seo.canonicalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              {seo.canonicalUrl}
            </a>
          ) : (
            <span className="text-muted-foreground">{t("seoDetailsNotSet")}</span>
          )}
        </dd>
      </div>
      <div className="min-w-0 space-y-1">
        <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Languages className="size-3.5" aria-hidden />
          {t("seoFormHreflangLabel")}
        </dt>
        <dd>
          {seo.hreflang.length ? (
            <ul className="space-y-1" dir="ltr">
              {seo.hreflang.map(({ lang, url }) => (
                <li key={lang} className="flex min-w-0 items-baseline gap-2">
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {lang}
                  </span>
                  <span className="truncate text-muted-foreground" title={url}>
                    {url}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground">{t("seoDetailsNotSet")}</span>
          )}
        </dd>
      </div>
    </dl>
  );
}

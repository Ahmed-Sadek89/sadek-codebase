import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { QueryProvider } from "@repo/provider/query-provider";
import { ThemeProvider } from "@repo/provider/theme-provider";
import { ToastProvider } from "@repo/provider/toast-provider";
import { DirectionProvider } from "@repo/ui/direction";
import "../styles.css";
import { getDirection, isLocale, LOCALES } from "../../i18n/config";
import {
  DEFAULT_ICONS,
  DEFAULT_OG_IMAGE,
  defaultOgImage,
  getSiteUrl,
} from "../../libs/seo/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

// Defaults for every page; page.tsx overrides them with the homepage's SEO
// row or the user info. metadataBase turns relative URLs (the fallback share
// image) into absolute ones, which Open Graph requires.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: t("metaRootTitle"),
    description: t("metaRootDescription"),
    icons: DEFAULT_ICONS,
    openGraph: {
      type: "website",
      images: [defaultOgImage()],
    },
    twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE] },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      // Smooth #section jumps that stop below the sticky header.
      className="scroll-smooth scroll-pt-20 motion-reduce:scroll-auto"
      suppressHydrationWarning
    >
      <body className={`${poppins.variable} min-w-[320px]`}>
        <NextIntlClientProvider>
          <DirectionProvider dir={dir}>
            <ThemeProvider defaultTheme="dark" enableSystem={false}>
              <QueryProvider>{children}</QueryProvider>
              {/* Sonner toasts from @repo/libs/toast (e.g. the contact form). */}
              <ToastProvider dir={dir} />
            </ThemeProvider>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

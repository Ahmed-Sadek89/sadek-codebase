import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { QueryProvider } from "@repo/provider/query-provider";
import { SessionProvider } from "@repo/provider/session-provider";
import { ThemeProvider } from "@repo/provider/theme-provider";
import { ToastProvider } from "@repo/provider/toast-provider";
import { DirectionProvider } from "@repo/ui/direction";
import "../styles.css";
import { APP_LOGO, DEFAULT_THEME } from "../../utils/constants";
import { getDirection, isLocale, LOCALES } from "../../i18n/config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const title = t("metaRootTitle");
  const description = t("metaRootDescription");
  return {
    title,
    description,
    icons: {
      icon: APP_LOGO,
      shortcut: APP_LOGO,
      apple: APP_LOGO,
    },
    openGraph: {
      title,
      description,
      images: [{ url: APP_LOGO, width: 1536, height: 1024, alt: "Sadek" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [APP_LOGO],
    },
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
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={poppins.variable}>
        <NextIntlClientProvider>
          <DirectionProvider dir={dir}>
            <ThemeProvider defaultTheme={DEFAULT_THEME} enableSystem>
              <SessionProvider>
                <QueryProvider>{children}</QueryProvider>
              </SessionProvider>
              <ToastProvider dir={dir} />
            </ThemeProvider>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

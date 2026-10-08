import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { QueryProvider } from "@repo/provider/query-provider";
import { SessionProvider } from "@repo/provider/session-provider";
import { ThemeProvider } from "@repo/provider/theme-provider";
import "./styles.css";
import { DEFAULT_THEME } from "../utils/constants";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});
export const metadata: Metadata = {
  title: "Sadek | Dashboard",
  description: "Sign in to your portfolio dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable}>
        <ThemeProvider defaultTheme={DEFAULT_THEME} enableSystem>
          <SessionProvider>
            <QueryProvider>{children}</QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

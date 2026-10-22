import { Poppins } from "next/font/google";
import { QueryProvider } from "@repo/provider/query-provider";
import { ThemeProvider } from "@repo/provider/theme-provider";
import "./styles.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} min-w-[320px]`}>
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

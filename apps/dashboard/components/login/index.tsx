import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader } from "@repo/ui/card";
import { LoginForm } from "./components/login-form";
import { Link } from "../../i18n/navigation";

export default async function LoginPage() {
  const t = await getTranslations();

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-12 text-foreground">
      <div className="w-full max-w-md space-y-8">
        <Card className="gap-7 border-border py-8 shadow-none">
          <CardHeader className="gap-y-6 flex flex-col px-6 sm:px-8">
            <div className="flex items-center justify-center w-full gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                S
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Sadek{" "}
                <span className="font-normal text-muted-foreground">
                  / {t("brandDashboard")}
                </span>
              </span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                {t("loginEyebrow")}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {t("loginTitle")}
              </h1>
            </div>
            <CardDescription className="leading-relaxed">
              {t("loginDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <LoginForm />
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-4">
              <Link
                href="/register"
                className="text-xs font-medium text-primary hover:underline"
                aria-label={t("loginSignUpAria")}
              >
                {t("loginNoAccount")}{" "}
                <span className="underline">{t("loginSignUp")}</span>
              </Link>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
                aria-label={t("loginForgotPasswordAria")}
              >
                {t("loginForgotPassword")}
              </Link>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          {t("loginTagline")}
        </p>
      </div>
    </main>
  );
}

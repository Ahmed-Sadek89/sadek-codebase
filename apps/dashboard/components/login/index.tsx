import { Card, CardContent, CardDescription, CardHeader } from "@repo/ui/card";
import { LoginForm } from "./components/login-form";
import Link from "next/link";

export default function LoginPage() {
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
                  / Dashboard
                </span>
              </span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Portfolio workspace
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h1>
            </div>
            <CardDescription className="leading-relaxed">
              Enter your details to sign in to your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <LoginForm />
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-4">
              <Link
                href="/register"
                className="text-xs font-medium text-primary hover:underline"
                aria-label="Create an account"
              >
                Don&apos;t have an account? <span className="underline">Sign up</span>
              </Link>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
                aria-label="Recover your password"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Your portfolio, all in one place.
        </p>
      </div>
    </main>
  );
}

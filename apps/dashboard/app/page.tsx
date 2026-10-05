import { redirect } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@repo/ui/card";
import { Input } from "@repo/ui/input";

async function signIn() {
  "use server";
  redirect("/dashboard");
}

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-12 text-foreground">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center gap-3">
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
        <Card className="gap-7 border-border py-8 shadow-none">
          <CardHeader className="gap-3 px-6 sm:px-8">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Portfolio workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <CardDescription className="leading-relaxed">
              Enter your details to sign in to your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <form action={signIn} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" className="mt-2 h-11 w-full">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Your portfolio, all in one place.
        </p>
      </div>
    </main>
  );
}

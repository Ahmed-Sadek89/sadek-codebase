"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { SIGNED_OUT_REDIRECT_PATH } from "../../utils/constants";

export default function Dashboard() {
  const t = useTranslations();

  return (
    <main>
      <h1 className="text-2xl font-semibold">{t("dashboardTitle")}</h1>
      <Button
        onClick={() => void signOut({ redirectTo: SIGNED_OUT_REDIRECT_PATH })}
      >
        {t("signOut")}
      </Button>
    </main>
  );
}

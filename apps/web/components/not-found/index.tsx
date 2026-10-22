import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { ArrowLeft } from "@repo/ui/icons";
import { Link } from "../../i18n/navigation";

export function NotFoundPage() {
  const t = useTranslations();
  return (
    <main className="relative grid min-h-svh place-items-center bg-radial-[circle_at_50%_30%] from-primary-muted from-0% to-transparent to-40% px-4 text-center">
      <div className="absolute top-1/4 left-1/2 h-[170px] w-[300px] -translate-x-1/2 bg-glow blur-[45px]" />
      <div className="relative">
        <span className="text-[10px] tracking-[0.12em] text-primary font-extrabold">
          {t("notFoundEyebrow")}
        </span>
        <h1 className="my-[14px] text-6xl leading-[1.1] tracking-[-0.04em] max-[700px]:text-[34px]">
          {t("notFoundTitle")}
        </h1>
        <p className="mx-auto mb-[22px] max-w-[420px] text-[11px] leading-[1.7] text-muted-foreground">
          {t("notFoundDescription")}
        </p>
        <Button asChild>
          {/* Locale-aware: "/" becomes "/en", "/ar", ... */}
          <Link className="text-[11px]" href="/">
            <ArrowLeft className="w-[13px] rtl:-scale-x-100" />{" "}
            {t("notFoundAction")}
          </Link>
        </Button>
      </div>
    </main>
  );
}

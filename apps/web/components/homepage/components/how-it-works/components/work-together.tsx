import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { ArrowRight } from "@repo/ui/icons";
import { Link } from "../../../../../i18n/navigation";

/** The "let's work together" call to action: a glass panel with the next steps. */
export function WorkTogether() {
  const t = useTranslations();
  return (
    <div className="relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-card/45 px-6 py-10 text-center shadow-2xl shadow-black/40 backdrop-blur-xl sm:mt-20 sm:px-12 sm:py-14">
      <span
        aria-hidden="true"
        className="absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
      />
      <span className="relative inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1 text-[11px] font-bold tracking-[0.18em] text-primary uppercase">
        {t("contactEyebrow")}
      </span>
      <h3 className="relative mt-5 text-2xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl">
        {t("contactHeading")}
      </h3>
      <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t("contactBody")}
      </p>
      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="h-12 rounded-full px-7 text-sm shadow-lg shadow-primary/40"
        >
          <Link href="#form">
            {t("contactStart")}
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </Link>
        </Button>
        <Button
          asChild
          className="h-12 rounded-full border-white/20 bg-white/5 px-7 text-sm text-foreground hover:bg-white/10"
          variant="outline"
        >
          <Link href="#work">{t("heroViewWork")}</Link>
        </Button>
      </div>
      <p className="relative mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
        <span aria-hidden="true" className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        {t("contactReplyTime")}
      </p>
    </div>
  );
}

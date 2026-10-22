import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { ArrowRight, ChevronDown } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { CvIcon } from "../../../../ui/brand-icon";
import { useCollapsible } from "../hooks";

/** The description (collapsible when long) with CV and contact calls to action. */
export function AboutStory({
  description,
  cvUrl,
}: {
  description: string;
  cvUrl?: string;
}) {
  const t = useTranslations();
  const { collapsible, collapsed, toggle } = useCollapsible(description);
  return (
    <div className="relative rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur sm:p-8">
      <span
        aria-hidden="true"
        className="absolute inset-y-8 start-0 w-1 rounded-e-full bg-linear-to-b from-primary to-accent-strong"
      />
      <p
        className={cn(
          "text-sm leading-[1.85] whitespace-pre-line text-muted-foreground sm:text-[15px]",
          collapsed && "line-clamp-6",
        )}
        id="about-description"
      >
        {description}
      </p>
      {collapsible && (
        <button
          aria-controls="about-description"
          aria-expanded={!collapsed}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          onClick={toggle}
          type="button"
        >
          {collapsed ? t("aboutReadMore") : t("aboutReadLess")}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 transition-transform",
              !collapsed && "rotate-180",
            )}
          />
        </button>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        {cvUrl && (
          <Button
            asChild
            className="h-11 rounded-full px-6 shadow-md shadow-primary/25"
          >
            <a href={cvUrl} rel="noreferrer" target="_blank">
              <CvIcon className="size-4" />
              {t("aboutDownloadCv")}
            </a>
          </Button>
        )}
        <Button asChild variant="outline" className="h-11 rounded-full px-6">
          <a href="#contact">
            {t("heroLetsTalk")}
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </a>
        </Button>
      </div>
    </div>
  );
}

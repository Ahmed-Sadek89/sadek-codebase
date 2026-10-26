import { useTranslations } from "next-intl";
import { ArrowUpRight } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { linkTarget, type ProfileLink } from "../../../utils";
import { profileLinkStyles } from "../../../../ui/brand-icon/profile-link-icon";

/**
 * The profile links (CV, email, phone, WhatsApp, LinkedIn, GitHub) as compact
 * cards in a two-column grid: the brand icon in a round badge, the label, and
 * an arrow that slides out on hover. The address or URL itself is not shown. `tone="inverse"` is for a primary-coloured
 * background: white glass cards instead of brand-colour hovers.
 */
export function ContactDetails({
  details,
  tone = "default",
}: {
  details: ProfileLink[];
  tone?: "default" | "inverse";
}) {
  const t = useTranslations();
  if (!details.length) return null;
  const inverse = tone === "inverse";
  return (
    // Two columns everywhere; three on tablets, where the panel is full width.
    <ul className="grid grid-cols-1 gap-2.5  sm:gap-3 sm:grid-cols-2">
      {details.map(({ kind, labelKey, href }) => {
        const { Icon, hover } = profileLinkStyles[kind];
        return (
          <li className="min-w-0" key={kind}>
            <a
              className={cn(
                "group relative flex h-full min-h-14 min-w-0 items-center gap-2.5 overflow-hidden rounded-2xl border py-2 ps-2 pe-2.5 text-sm no-underline sm:gap-3 transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:hover:translate-y-0",
                inverse
                  ? "border-white/20 bg-white/10 text-white backdrop-blur hover:border-white/40 hover:bg-white/20 hover:shadow-lg hover:shadow-black/10 focus-visible:outline-white"
                  : cn(
                      "border-border bg-background/60 text-muted-foreground hover:border-border-strong hover:shadow-md focus-visible:outline-ring",
                      hover,
                    ),
              )}
              href={href}
              rel="noreferrer"
              target={linkTarget(kind)}
            >
              {/* A soft glow on the start edge that brightens on hover. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-y-0 start-0 w-1 transition-opacity duration-200",
                  inverse
                    ? "bg-white/40 opacity-0 group-hover:opacity-100"
                    : "bg-primary/50 opacity-0 group-hover:opacity-100",
                )}
              />
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full shadow-md sm:size-10 transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100",
                  inverse
                    ? "bg-white text-primary shadow-black/10"
                    : "bg-card ring-1 ring-border",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 text-[13px] leading-tight font-semibold break-words sm:text-sm",
                  inverse ? "text-white" : "text-foreground",
                )}
              >
                {t(labelKey)}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "hidden size-7 shrink-0 place-items-center rounded-full min-[375px]:grid transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0 rtl:group-hover:-translate-x-0.5",
                  inverse
                    ? "bg-white/15 text-white group-hover:bg-white group-hover:text-primary"
                    : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground",
                )}
              >
                <ArrowUpRight className="size-4 rtl:-scale-x-100" />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

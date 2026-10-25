import { useTranslations } from "next-intl";
import { cn } from "@repo/ui/utils";
import { linkTarget, type ProfileLink } from "../../../utils";
import { profileLinkStyles } from "../../../../ui/brand-icon/profile-link-icon";

/**
 * The profile links (CV, email, phone, WhatsApp, LinkedIn, GitHub) as rows with their brand icons.
 * `tone="inverse"` is for a primary-coloured background: white glass rows
 * instead of brand-colour hovers.
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
    // One column on phones, two on tablets, one again from lg (side panel).
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {details.map(({ kind, labelKey, href, value }) => {
        const { Icon, hover } = profileLinkStyles[kind];
        return (
          <li className="min-w-0" key={kind}>
            <a
              className={cn(
                "group flex min-h-14 min-w-0 items-center gap-2.5 rounded-2xl border p-2.5 text-sm no-underline transition hover:-translate-y-0.5 sm:gap-3 sm:p-3",
                inverse
                  ? "border-white/15 bg-white/10 text-white backdrop-blur hover:border-white/30 hover:bg-white/20"
                  : cn(
                      "border-border bg-background/60 text-muted-foreground hover:border-border-strong hover:shadow-md",
                      hover,
                    ),
              )}
              href={href}
              rel="noreferrer"
              target={linkTarget(kind)}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-xl shadow-sm sm:size-10",
                  inverse
                    ? "bg-white text-primary"
                    : "bg-card ring-1 ring-border",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-xs font-medium",
                    inverse ? "text-white/70" : "text-muted-foreground",
                  )}
                >
                  {t(labelKey)}
                </span>
                {/* The address or number itself; links without their scheme. */}
                <span
                  className={cn(
                    "block wrap-anywhere font-semibold sm:truncate",
                    inverse ? "text-white" : "text-foreground",
                  )}
                  dir="ltr"
                >
                  {kind === "email"
                    ? value
                    : value.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

import { useTranslations } from "next-intl";
import { cn } from "@repo/ui/utils";
import type { ProfileLink } from "../../../utils";
import { profileLinkStyles } from "../../../../ui/brand-icon/profile-link-icon";

/** CV, email, LinkedIn and GitHub as full-width rows with their brand icons. */
export function ContactDetails({ details }: { details: ProfileLink[] }) {
  const t = useTranslations();
  if (!details.length) return null;
  return (
    <ul className="flex flex-col gap-3">
      {details.map(({ kind, labelKey, href, value }) => {
        const { Icon, hover } = profileLinkStyles[kind];
        return (
          <li key={kind}>
            <a
              className={cn(
                "group flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3 text-sm text-muted-foreground no-underline transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md",
                hover,
              )}
              href={href}
              rel="noreferrer"
              target={kind === "email" ? undefined : "_blank"}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card shadow-sm ring-1 ring-border">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-muted-foreground">
                  {t(labelKey)}
                </span>
                {/* The address itself for email; the link for the others. */}
                <span
                  className="block truncate font-semibold text-foreground"
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

import { useTranslations } from "next-intl";
import { cn } from "@repo/ui/utils";
import type { ProfileLink } from "../../../utils";
import { profileLinkStyles } from "../../../../ui/brand-icon/profile-link-icon";

/** CV, email, LinkedIn and GitHub as chips with their brand icons. */
export function ContactDetails({ details }: { details: ProfileLink[] }) {
  const t = useTranslations();
  if (!details.length) return null;
  return (
    <ul className="mb-6 flex flex-wrap justify-center gap-2.5">
      {details.map(({ kind, labelKey, href, value }) => {
        const { Icon, hover } = profileLinkStyles[kind];
        return (
          <li key={kind}>
            <a
              className={cn(
                "flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[11px] text-muted-foreground no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md",
                hover,
              )}
              href={href}
              rel="noreferrer"
              target={kind === "email" ? undefined : "_blank"}
            >
              <Icon className="size-4" />
              {/* The address itself for email; a translated label otherwise. */}
              {kind === "email" ? <span dir="ltr">{value}</span> : t(labelKey)}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

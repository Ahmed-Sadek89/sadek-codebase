import { useTranslations } from "next-intl";
import { cn } from "@repo/ui/utils";
import type { ProfileLink } from "../../../homepage/utils";
import { profileLinkStyles } from "../../../ui/brand-icon/profile-link-icon";

/** Round brand-icon buttons for the owner's links; brand colour on hover. */
export function SocialButtons({ links }: { links: ProfileLink[] }) {
  const t = useTranslations();
  if (!links.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map(({ kind, labelKey, href }) => {
        const { Icon, hover } = profileLinkStyles[kind];
        return (
          <li key={kind}>
            <a
              aria-label={t(labelKey)}
              className={cn(
                "grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md",
                hover,
              )}
              href={href}
              rel="noreferrer"
              target={kind === "email" ? undefined : "_blank"}
              title={t(labelKey)}
            >
              <Icon className="size-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

import { useTranslations } from "next-intl";
import { cn } from "@repo/ui/utils";
import type { ProfileLink } from "../../../utils";
import { profileLinkStyles } from "../../../../ui/brand-icon/profile-link-icon";

/** Round icon buttons for CV, email, LinkedIn and GitHub, in brand colours on hover. */
export function SocialLinks({ links }: { links: ProfileLink[] }) {
  const t = useTranslations();
  if (!links.length) return null;
  return (
    <ul className="relative flex justify-center gap-3">
      {links.map(({ kind, labelKey, href }) => {
        const { Icon, hover } = profileLinkStyles[kind];
        return (
          <li key={kind}>
            <a
              aria-label={t(labelKey)}
              className={cn(
                "grid size-10 place-items-center rounded-full border border-border bg-card/70 text-muted-foreground shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
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

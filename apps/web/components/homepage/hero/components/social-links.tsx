import { useTranslations } from "next-intl";
import type { SocialLink } from "../utils";

export function SocialLinks({ links }: { links: SocialLink[] }) {
  const t = useTranslations();
  if (!links.length) return null;
  return (
    <div className="flex justify-center gap-4 text-muted-foreground">
      {links.map(({ labelKey, href, Icon }) => (
        <a
          aria-label={t(labelKey)}
          className="hover:text-primary"
          href={href}
          key={labelKey}
          rel="noreferrer"
          target="_blank"
        >
          <Icon className="w-4" />
        </a>
      ))}
    </div>
  );
}

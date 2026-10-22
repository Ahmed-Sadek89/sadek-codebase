import type { SocialLink } from "../utils";

export function SocialLinks({ links }: { links: SocialLink[] }) {
  if (!links.length) return null;
  return (
    <div className="flex justify-center gap-4 text-muted-foreground">
      {links.map(({ label, href, Icon }) => (
        <a
          aria-label={label}
          className="hover:text-primary"
          href={href}
          key={label}
          rel="noreferrer"
          target="_blank"
        >
          <Icon className="w-4" />
        </a>
      ))}
    </div>
  );
}

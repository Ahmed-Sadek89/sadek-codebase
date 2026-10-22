import type { ContactDetail } from "../utils";

export function ContactDetails({ details }: { details: ContactDetail[] }) {
  if (!details.length) return null;
  return (
    <div className="mb-5 flex justify-center gap-5 text-[10px] text-muted-foreground max-[700px]:flex-col max-[700px]:items-center max-[700px]:gap-2">
      {details.map(({ label, href, Icon }) => (
        <a
          className="flex items-center gap-[5px] text-muted-foreground no-underline hover:text-primary"
          href={href}
          key={href}
          rel="noreferrer"
          target={href.startsWith("mailto:") ? undefined : "_blank"}
        >
          <Icon className="w-3 text-primary" /> {label}
        </a>
      ))}
    </div>
  );
}

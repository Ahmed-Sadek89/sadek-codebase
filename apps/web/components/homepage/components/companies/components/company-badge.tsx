import Image from "next/image";
import type { CompanyBadge as CompanyBadgeData } from "../utils";

export function CompanyBadge({ company }: { company: CompanyBadgeData }) {
  const content = (
    <>
      {company.logo && (
        <Image
          alt=""
          className="size-4 rounded-sm object-contain"
          height={16}
          src={company.logo}
          unoptimized
          width={16}
        />
      )}
      <b>{company.name}</b>
    </>
  );
  const className =
    "flex items-center gap-1.5 text-xs tracking-normal text-muted-foreground no-underline";
  return company.site ? (
    <a
      className={`${className} hover:text-primary`}
      href={company.site}
      rel="noreferrer"
      target="_blank"
    >
      {content}
    </a>
  ) : (
    <span className={className}>{content}</span>
  );
}

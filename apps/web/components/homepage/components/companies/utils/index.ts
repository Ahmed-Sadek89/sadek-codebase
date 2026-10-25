import type { Settings } from "react-slick";
import type { UserCompany } from "@repo/types/user-company";
import { getInitials } from "../../../../../utils/initials";
import { hasText } from "../../../utils";

export type CompanyBadge = {
  id: number;
  name: string;
  initials: string;
  logo?: string;
  site?: string;
};

/** A company as the strip shows it: its name, logo and site. */
export function toCompanyBadge(company: UserCompany): CompanyBadge {
  const name = company.company_name;
  return {
    id: company.id,
    name,
    initials: getInitials(name),
    logo: hasText(company.logo) ? company.logo : undefined,
    site: hasText(company.company_site) ? company.company_site : undefined,
  };
}

/**
 * Repeats a short list until it has `min` items, so the endless carousel
 * never shows an empty gap. Each copy gets its own key.
 */
export function fillTrack<T>(items: T[], min = 10) {
  if (!items.length) return [];
  const copies = Math.max(1, Math.ceil(min / items.length));
  return Array.from({ length: copies }, (_, copy) =>
    items.map((item, index) => ({ item, key: `${copy}-${index}` })),
  ).flat();
}

/**
 * A continuous, slow marquee: the next move starts at once (autoplaySpeed 0)
 * and glides linearly for `speed` ms, so the logos drift instead of jumping.
 */
export const carouselSettings: Settings = {
  arrows: false,
  dots: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 0,
  speed: 6000,
  cssEase: "linear",
  variableWidth: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  pauseOnHover: true,
  pauseOnFocus: true,
};

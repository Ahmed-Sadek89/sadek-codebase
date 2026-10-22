"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import type { UserCompany } from "@repo/types/user-company";
import { useCarouselTrack, usePrefersReducedMotion } from "../hooks";
import { carouselSettings } from "../utils";
import { CompanyBadge } from "./company-badge";

/** The companies drifting slowly in an endless loop; pauses on hover or focus. */
export function CompaniesCarousel({ companies }: { companies: UserCompany[] }) {
  const track = useCarouselTrack(companies);
  const reducedMotion = usePrefersReducedMotion();
  return (
    // Always laid out left to right: react-slick's RTL mode misbehaves with
    // autoplay, and a looping logo strip reads the same either way.
    <div
      className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      dir="ltr"
    >
      <Slider {...carouselSettings} autoplay={!reducedMotion}>
        {track.map(({ item, key }) => (
          // Vertical padding leaves room for the hover lift inside slick's clipped list.
          <div className="px-2 py-2 sm:px-3" key={key}>
            <CompanyBadge company={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

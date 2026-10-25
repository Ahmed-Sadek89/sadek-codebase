"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { UserCompany } from "@repo/types/user-company";
import { fillTrack, toCompanyBadge } from "../utils";

export function useCompanyBadges(companies: UserCompany[]) {
  return useMemo(
    () => companies.map((company) => toCompanyBadge(company)),
    [companies],
  );
}

/** The badges, repeated as needed to fill the endless carousel track. */
export function useCarouselTrack(companies: UserCompany[]) {
  const badges = useCompanyBadges(companies);
  return useMemo(() => fillTrack(badges), [badges]);
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** True when the user asked the OS for less motion. Always false on the server. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

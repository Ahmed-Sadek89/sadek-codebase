"use client";

import { useEffect, useState } from "react";

/**
 * The id of the section currently in the middle band of the viewport, for
 * highlighting its nav link. Sections that are not on the page are ignored.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section) => section !== null);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      // A thin band around the middle of the screen: one section at a time.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

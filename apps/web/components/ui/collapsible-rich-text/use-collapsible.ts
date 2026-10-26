"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Clamps a block to its CSS max-height until expanded. `isOverflowing` turns
 * true once the content is taller than the clamp (measured with a
 * ResizeObserver, so it follows font loading and screen width), which is when
 * the fade and the "Read more" toggle should show.
 */
export function useCollapsible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    // Fires once on observe, then on every resize of the clamped box.
    const observer = new ResizeObserver(() => {
      // While expanded there is no clamp to compare against; keep the last value.
      if (element.dataset.expanded === "true") return;
      setIsOverflowing(element.scrollHeight > element.clientHeight + 1);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => setIsExpanded((expanded) => !expanded), []);

  return { ref, isOverflowing, isExpanded, toggle };
}

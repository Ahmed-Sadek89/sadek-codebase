"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "../../../i18n/navigation";

/**
 * Asks before leaving a form with unsaved changes: `requestLeave(href)`
 * navigates straight away when clean, otherwise opens a confirmation
 * (`isConfirmOpen`) whose `confirmLeave` navigates. While dirty, closing or
 * reloading the tab shows the browser's own prompt.
 */
export function useLeaveGuard(isDirty: boolean) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const requestLeave = useCallback(
    (href: string) => {
      if (isDirty) setPendingHref(href);
      else router.push(href);
    },
    [isDirty, router],
  );

  const confirmLeave = useCallback(() => {
    if (pendingHref) router.push(pendingHref);
  }, [pendingHref, router]);

  const onConfirmOpenChange = useCallback((open: boolean) => {
    if (!open) setPendingHref(null);
  }, []);

  return {
    requestLeave,
    isConfirmOpen: pendingHref !== null,
    onConfirmOpenChange,
    confirmLeave,
  };
}

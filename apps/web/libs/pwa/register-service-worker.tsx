"use client";

import { useEffect } from "react";
import { SERVICE_WORKER_URL } from "./constants";

/**
 * Registers public/sw.js once the page has loaded. Production only: in
 * development a caching worker would serve stale builds, so any worker left
 * from a production run on this origin is removed instead.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.forEach((registration) => registration.unregister()));
      return;
    }

    const register = () => {
      void navigator.serviceWorker
        // updateViaCache "none": always check the server for a new sw.js.
        .register(SERVICE_WORKER_URL, { scope: "/", updateViaCache: "none" })
        .catch(() => {
          // Not supported (e.g. some private modes): the site works without it.
        });
    };
    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}

"use client";

import { useEffect, useState } from "react";
import { usePublicUserInfos } from "@repo/hooks/user-info";
import { userInfoQuery } from "./utils";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => setProgress(window.scrollY);
    update();
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

/**
 * The default-view user's info (GET /user-info/public). Hero, About,
 * Experience and Contact all read it; they share one cached request.
 */
export function usePortfolioInfo() {
  const { data, ...rest } = usePublicUserInfos(userInfoQuery);
  return { info: data?.data[0], ...rest };
}

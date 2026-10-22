"use client";

import { usePortfolioInfo } from "../../hooks";
import { getContactDetails } from "../utils";

export function useContactDetails() {
  const { info } = usePortfolioInfo();
  return info ? getContactDetails(info) : [];
}

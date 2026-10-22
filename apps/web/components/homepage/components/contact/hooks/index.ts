"use client";

import { useMemo } from "react";
import type { UserInfoDetails } from "@repo/types/user-info";
import { getContactDetails } from "../utils";

export function useContactDetails(info: UserInfoDetails | undefined) {
  return useMemo(() => (info ? getContactDetails(info) : []), [info]);
}

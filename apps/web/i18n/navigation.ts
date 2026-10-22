import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware wrappers: hrefs stay locale-free ("/") and get the current prefix.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

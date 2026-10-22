import { notFound } from "next/navigation";

// Unknown paths under a locale (/en/whatever) render the localized [locale]/not-found.tsx.
export default function CatchAllPage() {
  notFound();
}

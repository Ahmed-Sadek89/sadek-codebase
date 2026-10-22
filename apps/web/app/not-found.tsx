import type { Metadata } from "next";
import { NotFoundPage } from "../components/not-found";
import { notFoundCopy } from "../components/not-found/utils";

export const metadata: Metadata = {
  title: notFoundCopy.title,
};

// Unknown URLs, and notFound() from page.tsx when there is no portfolio to show.
export default function NotFound() {
  return <NotFoundPage />;
}

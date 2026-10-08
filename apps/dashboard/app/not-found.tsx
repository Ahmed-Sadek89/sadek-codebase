import type { Metadata } from "next";
import NotFoundPage from "../components/ui/streams/not-found";

export const metadata: Metadata = {
  title: "Page not found | Sadek Dashboard",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return <NotFoundPage />;
}

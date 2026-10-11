"use client";

import ServerErrorPage, {
  type ServerErrorPageProps,
} from "../../components/ui/streams/server-error";

// Catches errors thrown while rendering any page under the locale layout.
export default function ErrorBoundary({ error, retry }: ServerErrorPageProps) {
  return <ServerErrorPage error={error} retry={retry} />;
}

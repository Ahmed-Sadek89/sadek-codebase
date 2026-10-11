"use client";

import ServerErrorPage, {
  type ServerErrorPageProps,
} from "../../../components/ui/streams/server-error";

// Renders inside the dashboard layout, so the header and sidebar stay usable.
export default function DashboardErrorBoundary({
  error,
  retry,
}: ServerErrorPageProps) {
  return <ServerErrorPage error={error} retry={retry} fullScreen={false} />;
}

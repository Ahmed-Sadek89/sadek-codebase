import { ImageResponse } from "next/og";
import { NextResponse, type NextRequest } from "next/server";
import { getHomeSeo } from "../../../../libs/seo/seo";
import { PWA_BACKGROUND_COLOR } from "../../../../libs/pwa/constants";
import { isPwaIconFile, PWA_ICON_FILES } from "../../../../libs/pwa/icons";

/** How much of the square the artwork fills, per icon kind. */
const ARTWORK_SCALE = {
  // Same as the browser tab icon: the whole square.
  any: 1,
  // Android masks keep only a centered circle of 80% of the width.
  maskable: 0.74,
  // iOS rounds the corners a little.
  apple: 0.9,
} as const;

/**
 * GET /icons/pwa/<file>: the installed app's icons, drawn from the tab icon
 * uploaded in the dashboard (the homepage SEO row's `favicon`), so the home
 * screen / dock / taskbar shows the same picture as the browser tab. Without
 * an upload (or if it can't be drawn), redirects to the built-in icon.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/icons/pwa/[file]">,
) {
  const { file } = await params;
  if (!isPwaIconFile(file)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { size, kind, fallback } = PWA_ICON_FILES[file];
  const fallbackResponse = () =>
    NextResponse.redirect(new URL(fallback, request.url), 307);

  const favicon = (await getHomeSeo("en"))?.favicon;
  if (!favicon) return fallbackResponse();

  const artwork = Math.round(size * ARTWORK_SCALE[kind]);
  try {
    const image = new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // "any" stays transparent like the tab icon; the others need a
            // solid square behind the artwork.
            background: kind === "any" ? "transparent" : PWA_BACKGROUND_COLOR,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by ImageResponse, not the DOM */}
          <img src={favicon} width={artwork} height={artwork} alt="" style={{ objectFit: "contain" }} />
        </div>
      ),
      { width: size, height: size },
    );
    // Render now, so a broken upload falls back instead of failing mid-stream.
    const body = await image.arrayBuffer();
    return new NextResponse(body, {
      headers: {
        "Content-Type": "image/png",
        // The URL carries ?v=<upload version>, so a new upload is a new URL.
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return fallbackResponse();
  }
}


const CDN_URL =
  process.env.NEXT_PUBLIC_CLOUDFRONT_URL!;

export function getMediaUrl(key: string) {
  const safeKey = key
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${CDN_URL}/${safeKey}`;
}

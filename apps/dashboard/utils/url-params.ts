/**
 * Updates URL query params in place. `null` removes a param. Uses the History
 * API, which Next.js syncs with `useSearchParams`, so there is no server
 * round trip: only client queries keyed on the params refetch.
 * `push` adds a history entry (pagination: Back works); `replace` does not
 * (typing in search).
 */
export function updateUrlParams(
  updates: Record<string, string | null>,
  mode: "push" | "replace" = "replace",
) {
  const params = new URLSearchParams(window.location.search);
  for (const [name, value] of Object.entries(updates)) {
    if (value === null || value === "") params.delete(name);
    else params.set(name, value);
  }
  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

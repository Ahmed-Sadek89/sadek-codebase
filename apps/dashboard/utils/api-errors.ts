/** True for the backend's 404 (an Axios error whose response status is 404). */
export function isNotFoundError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return false;
  }
  const { response } = error as { response?: { status?: number } };
  return response?.status === 404;
}

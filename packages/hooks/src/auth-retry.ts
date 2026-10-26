/** True for an HTTP 401 (an Axios-style error whose response status is 401). */
export function isUnauthorizedError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return false;
  }
  const { response } = error as { response?: { status?: number } };
  return response?.status === 401;
}

/**
 * Runs `call` with `token`. On a 401 it asks for a fresh token (reading the
 * NextAuth session refreshes an expired access token) and retries once with
 * it; when there is no new token, it calls `onSignedOut` and rethrows. Other
 * errors, and a second 401, are thrown unchanged.
 */
export async function withAuthRetry<T>(
  call: (token: string) => Promise<T>,
  token: string,
  getFreshToken: () => Promise<string | undefined>,
  onSignedOut: () => void | Promise<void>,
): Promise<T> {
  try {
    return await call(token);
  } catch (error) {
    if (!isUnauthorizedError(error)) throw error;
    const fresh = await getFreshToken();
    if (!fresh || fresh === token) {
      await onSignedOut();
      throw error;
    }
    return call(fresh);
  }
}

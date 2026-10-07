import assert from "node:assert/strict";
import { test, mock, afterEach } from "node:test";
import type { AuthService } from "../src/auth-tokens.ts";
const authService: Pick<AuthService, "refresh"> = {
  async refresh() {
    throw new Error("Unexpected refresh request");
  },
};
import { refreshTokens, tokenExpiresAt } from "../src/auth-tokens.ts";

afterEach(() => mock.restoreAll());
const requestConfig = { baseURL: "http://backend.example" };

const jwt = (exp: number) =>
  `header.${Buffer.from(JSON.stringify({ exp })).toString("base64url")}.signature`;
const future = Math.floor(Date.now() / 1000) + 3600;
const session = {
  accessToken: "old",
  refreshToken: "refresh",
  accessTokenExpires: 1,
  refreshTokenExpires: future * 1000,
};

test("uses valid access token without refreshing", async () => {
  const valid = { ...session, accessTokenExpires: future * 1000 };
  const refresh = mock.method(authService, "refresh");
  assert.equal(await refreshTokens(valid, requestConfig, authService), valid);
  assert.equal(refresh.mock.callCount(), 0);
});
test("replaces expired access token and retains refresh token", async () => {
  const accessToken = jwt(future);
  mock.method(authService, "refresh", async (request, config) => {
    assert.equal(request.refreshToken, "refresh");
    assert.deepEqual(config, requestConfig);
    return { access_token: accessToken };
  });
  const result = await refreshTokens(session, requestConfig, authService);
  assert.equal(result?.accessToken, accessToken);
  assert.equal(result?.accessTokenExpires, future * 1000);
  assert.equal(result?.refreshToken, "refresh");
});
test("missing access token or invalid expiry never triggers refresh", async () => {
  for (const invalid of [
    { ...session, accessToken: undefined },
    { ...session, accessTokenExpires: undefined },
    { ...session, accessTokenExpires: NaN },
    { ...session, accessTokenExpires: Infinity },
  ]) {
    const refresh = mock.method(authService, "refresh");
    const result = await refreshTokens(invalid, requestConfig, authService);
    assert.equal(result, null);
    assert.equal(refresh.mock.callCount(), 0);
  }
});
test("expired refresh token discards both tokens even with valid access", async () => {
  const refresh = mock.method(authService, "refresh");
  assert.equal(
    await refreshTokens(
      { ...session, refreshTokenExpires: 1, accessTokenExpires: future * 1000 },
      requestConfig,
      authService,
    ),
    null,
  );
  assert.equal(refresh.mock.callCount(), 0);
});
test("failed refresh, malformed token, or expired replacement discards session", async () => {
  for (const refresh of [
    async () => {
      throw new Error("unauthorized");
    },
    async () => ({ access_token: "bad" }),
    async () => ({ access_token: jwt(1) }),
  ]) {
    mock.method(authService, "refresh", refresh);
    assert.equal(
      await refreshTokens(session, requestConfig, authService),
      null,
    );
    mock.restoreAll();
  }
});
test("rejects missing expiry", () => {
  assert.throws(() => tokenExpiresAt("invalid"));
});

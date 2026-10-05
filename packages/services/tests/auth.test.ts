import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { apiClient, getApiErrorMessage } from "@repo/libs/axios";
import { authService } from "../src/auth.ts";

const originalAdapter = apiClient.defaults.adapter;
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter;
});

function mockRequest(
  method: string,
  url: string,
  body: unknown,
  response: unknown,
  token?: string,
) {
  apiClient.defaults.adapter = async (config) => {
    assert.equal(config.method, method);
    assert.equal(config.baseURL, "/api");
    assert.equal(config.url, url);
    assert.deepEqual(config.data ? JSON.parse(config.data) : undefined, body);
    assert.equal(
      config.headers.get("Authorization"),
      token ? `Bearer ${token}` : undefined,
    );
    return {
      data: response,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
}

test("login sends credentials and preserves the backend user/token contract", async () => {
  const request = { email: "test@example.com", password: "test-password" };
  const response = {
    user: { sub: 1, email: request.email },
    access_token: "access",
    refresh_token: "refresh",
  };
  mockRequest("post", "/auth/login", request, response);
  assert.deepEqual(await authService.login(request), response);
});

test("refresh sends the refresh token in the Bearer header with no body", async () => {
  const response = { access_token: "renewed" };
  mockRequest("post", "/auth/refresh", undefined, response, "refresh");
  assert.deepEqual(
    await authService.refresh({ refreshToken: "refresh" }),
    response,
  );
});

test("change password uses PATCH, the access token, and the complete DTO", async () => {
  const request = {
    email: "test@example.com",
    password: "old",
    newPassword: "NewPass1!",
    confirmPassword: "NewPass1!",
  };
  const response = { message: "Password changed successfully" };
  mockRequest("patch", "/auth/change-password", request, response, "access");
  assert.deepEqual(
    await authService.changePassword(request, { accessToken: "access" }),
    response,
  );
});

test("logout sends only the access Bearer token", async () => {
  const response = { message: "Logout successfully" };
  mockRequest("post", "/auth/logout", undefined, response, "access");
  assert.deepEqual(
    await authService.logout({ accessToken: "access" }),
    response,
  );
});

test("request failures propagate to the hook instead of returning success", async () => {
  const failure = new Error("Unavailable");
  apiClient.defaults.adapter = async () => {
    throw failure;
  };
  await assert.rejects(
    authService.login({ email: "test@example.com", password: "password" }),
    failure,
  );
});

test("API errors handle Nest messages and do not expose network request details", () => {
  assert.equal(
    getApiErrorMessage({
      isAxiosError: true,
      response: { data: { message: "Invalid email or password" } },
    }),
    "Invalid email or password",
  );
  assert.equal(
    getApiErrorMessage({
      isAxiosError: true,
      response: { data: { message: ["Email invalid", "Password required"] } },
    }),
    "Email invalid Password required",
  );
  assert.equal(
    getApiErrorMessage({ isAxiosError: true, message: "sensitive request" }),
    "Unable to reach the server. Please try again.",
  );
});

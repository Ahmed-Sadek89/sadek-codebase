import assert from "node:assert/strict";
import { test } from "node:test";
import { isUnauthorizedError, withAuthRetry } from "../src/auth-retry.ts";

const httpError = (status: number) =>
  Object.assign(new Error(`HTTP ${status}`), { response: { status } });

/** Records every call so a test can assert on order and count. */
function setup({
  responses,
  freshToken,
}: {
  /** One entry per call: a value to resolve with or an error to throw. */
  responses: unknown[];
  freshToken?: string;
}) {
  const calls: string[] = [];
  let refreshes = 0;
  let signOuts = 0;
  const call = async (token: string) => {
    calls.push(token);
    const response = responses[calls.length - 1];
    if (response instanceof Error) throw response;
    return response;
  };
  const getFreshToken = async () => {
    refreshes += 1;
    return freshToken;
  };
  const onSignedOut = () => {
    signOuts += 1;
  };
  return {
    run: () => withAuthRetry(call, "old", getFreshToken, onSignedOut),
    calls,
    counts: () => ({ refreshes, signOuts }),
  };
}

test("isUnauthorizedError matches only a 401 response", () => {
  assert.equal(isUnauthorizedError(httpError(401)), true);
  assert.equal(isUnauthorizedError(httpError(403)), false);
  assert.equal(isUnauthorizedError(new Error("network")), false);
  assert.equal(isUnauthorizedError(null), false);
  assert.equal(isUnauthorizedError("401"), false);
});

test("a successful request runs once and never asks for a new token", async () => {
  const { run, calls, counts } = setup({ responses: ["data"] });
  assert.equal(await run(), "data");
  assert.deepEqual(calls, ["old"]);
  assert.deepEqual(counts(), { refreshes: 0, signOuts: 0 });
});

test("a 401 gets a fresh token and retries once with it", async () => {
  const { run, calls, counts } = setup({
    responses: [httpError(401), "data"],
    freshToken: "new",
  });
  assert.equal(await run(), "data");
  assert.deepEqual(calls, ["old", "new"]);
  assert.deepEqual(counts(), { refreshes: 1, signOuts: 0 });
});

test("a 401 with no new token signs out and rethrows the 401", async () => {
  for (const freshToken of [undefined, "old"]) {
    const unauthorized = httpError(401);
    const { run, calls, counts } = setup({
      responses: [unauthorized],
      freshToken,
    });
    await assert.rejects(run(), (error) => error === unauthorized);
    assert.deepEqual(calls, ["old"]);
    assert.deepEqual(counts(), { refreshes: 1, signOuts: 1 });
  }
});

test("a second 401 after the retry is thrown, with no loop and no sign-out", async () => {
  const second = httpError(401);
  const { run, calls, counts } = setup({
    responses: [httpError(401), second],
    freshToken: "new",
  });
  await assert.rejects(run(), (error) => error === second);
  assert.deepEqual(calls, ["old", "new"]);
  assert.deepEqual(counts(), { refreshes: 1, signOuts: 0 });
});

test("other errors are thrown untouched, with no refresh and no sign-out", async () => {
  for (const failure of [httpError(500), new Error("network")]) {
    const { run, calls, counts } = setup({ responses: [failure] });
    await assert.rejects(run(), (error) => error === failure);
    assert.deepEqual(calls, ["old"]);
    assert.deepEqual(counts(), { refreshes: 0, signOuts: 0 });
  }
});

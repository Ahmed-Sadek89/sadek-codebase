import assert from "node:assert/strict";
import { test } from "node:test";
import { createQueryClient, getQueryClient } from "../src/query.ts";

test("server QueryClients isolate user caches", () => {
  const first = getQueryClient();
  const second = getQueryClient();
  assert.notEqual(first, second);
  first.setQueryData(["auth", "session"], { access_token: "test-token" });
  assert.equal(second.getQueryData(["auth", "session"]), undefined);
  first.clear();
  second.clear();
});

test("configuration prevents mutation retries and repeated focus fetches", () => {
  const client = createQueryClient();
  const defaults = client.getDefaultOptions();
  assert.equal(defaults.queries?.staleTime, undefined);
  assert.equal(defaults.queries?.gcTime, undefined);
  assert.equal(defaults.queries?.retry, 1);
  assert.equal(defaults.queries?.refetchOnWindowFocus, false);
  assert.equal(defaults.mutations?.retry, false);
  assert.equal(defaults.mutations?.gcTime, undefined);
  client.clear();
});

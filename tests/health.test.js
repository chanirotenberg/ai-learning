import test from "node:test";
import assert from "node:assert/strict";
import { getHealthStatus } from "../week-15-claude-api/health.js";

test("getHealthStatus returns ok status", () => {
  assert.deepStrictEqual(getHealthStatus(), { status: "ok" });
});

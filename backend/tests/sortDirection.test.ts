import assert from "node:assert/strict";
import { test } from "node:test";
import { getSortDirection } from "../src/utils/sortDirection.js";

test("allows ascending and descending product sorting", () => {
  assert.equal(getSortDirection("asc"), "ASC");
  assert.equal(getSortDirection("desc"), "DESC");
  assert.equal(getSortDirection("DESC"), "DESC");
});

test("defaults unexpected values to ascending", () => {
  assert.equal(getSortDirection(undefined), "ASC");
  assert.equal(getSortDirection(["desc"]), "ASC");
  assert.equal(getSortDirection("unsupported"), "ASC");
});

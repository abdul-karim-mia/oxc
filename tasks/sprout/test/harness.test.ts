import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { runSprout } from "../src/index.ts";
import { exclusion } from "../src/selection.ts";
import { evaluatorCode } from "../src/transform.ts";

const root = new URL("./fixtures/", import.meta.url);
for (const name of readdirSync(root).sort()) {
  const fixture = JSON.parse(readFileSync(new URL(name, root), "utf8"));
  void test(name, () => {
    const result = runSprout(
      evaluatorCode(fixture.original, name + ".tsx"),
      evaluatorCode(fixture.compiled, name + ".tsx"),
    );
    assert.equal(result.kind, fixture.expected, result.value);
  });
}

void test("selection distinguishes placeholders from malformed enrolled entrypoints", () => {
  assert.equal(
    exclusion("test.js", "export const FIXTURE_ENTRYPOINT={fn:Component,params:[]}"),
    null,
  );
  assert.equal(exclusion("test.js", "export const FIXTURE_ENTRYPOINT={fn:Component}"), null);
  assert.match(
    exclusion(
      "test.js",
      "export const FIXTURE_ENTRYPOINT={fn:Component,params:['TodoAdd'],isComponent:'TodoAdd'}",
    )!,
    /placeholder/,
  );
  assert.equal(
    exclusion("test.js", "// FIXTURE_ENTRYPOINT\nfunction Component(){}"),
    "No entrypoint",
  );
  assert.equal(exclusion("nested/error.invalid-test.js", ""), "Expected compiler diagnostics");
  assert.equal(exclusion("test.js", '// @outputMode:"lint"'), "Lint-only fixture");
});

void test("an empty filter fails without compiling", () => {
  const result = spawnSync(
    process.execPath,
    [
      fileURLToPath(new URL("../src/runner.ts", import.meta.url)),
      "--filter",
      "__sprout_no_such_fixture__",
    ],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /No runnable fixtures selected/);
});

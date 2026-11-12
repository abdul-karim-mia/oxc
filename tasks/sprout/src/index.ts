/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { doEval } from "./evaluator.ts";
import { compareResults, type SproutResult } from "./results.ts";

export { type SproutResult } from "./results.ts";

export function runSprout(originalCode: string, compiledCode: string): SproutResult {
  let compiled;
  try {
    (globalThis as any).__SNAP_EVALUATOR_MODE = "forget";
    compiled = doEval(compiledCode);
  } finally {
    (globalThis as any).__SNAP_EVALUATOR_MODE = undefined;
  }
  const original = originalCode.includes("@disableNonForgetInSprout") ? null : doEval(originalCode);
  return compareResults(original, compiled);
}

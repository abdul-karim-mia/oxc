// Snapshot-only fixtures must state the concrete runtime limitation.
export const runtimeExclusions = new Map([
  ["ssa-for-trivial-update.js", "Entrypoint contains an intentional infinite loop"],
  ["ssa-while-no-reassign.js", "Entrypoint contains an intentional infinite loop"],
  ["reanimated-no-memo-arg.js", "Requires the React Native Reanimated runtime"],
  ["flag-enable-emit-hook-guards.ts", "Upstream entrypoint uses args instead of params"],
  [
    "lowercase-context-variable-as-jsx-element-tag.js",
    "Module initialization calls the undefined helper getTitle",
  ],
  [
    "fast-refresh-refresh-on-const-changes-dev.js",
    "Requires Fast Refresh to invalidate caches after changing module globals",
  ],
  [
    "early-return-no-declarations-reassignments-dependencies.js",
    "Intentionally observes render-phase console.log calls removed by upstream memoization",
  ],
  [
    "capturing-function-decl.js",
    "Calls t.foo(), but the fixture only defines t.a; retained for closure lowering snapshots",
  ],
  [
    "capturing-function-skip-computed-path.js",
    "Immediately invokes a callback without its gift argument; retained for computed dependency snapshots",
  ],
  [
    "constant-computed.js",
    "Unconditionally calls x.foo after assigning it NaN; retained for computed-access snapshots",
  ],
  [
    "function-declaration-simple.js",
    "Calls p.foo() on an object that has no foo method; retained for function declaration snapshots",
  ],
  [
    "for-empty-update.js",
    "Loop never increments i and cannot terminate when props.count is positive",
  ],
  [
    "overlapping-scopes-while.js",
    "Loop condition c never changes; retained for overlapping-scope snapshots",
  ],
  ["ssa-nested-loops-no-reassign.js", "Nested loop conditions never change and contain no exit"],
  [
    "while-conditional-continue.js",
    "Loop condition a never changes and every branch continues without an exit",
  ],
  ["while-logical.js", "Loop repeatedly doubles zero without changing its condition"],
  ["while-property.js", "Loop condition a.b.c never changes and contains no exit"],
]);

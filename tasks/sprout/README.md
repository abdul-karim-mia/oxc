# Sprout

Runtime conformance checks for Oxc's React Compiler fixtures. Run after installing
workspace dependencies:

```sh
just sprout
just sprout --filter sprout/
pnpm --dir tasks/sprout test-harness
```

The Rust bridge compiles the fixture sources using the same pragma parser and
type providers as the compiler snapshot suite. JavaScript workers lower the
original and compiled sources with the same Babel transforms, render them with
React, and compare output, exceptions, and console logs. Each lane has a separate
React environment; mounts are cleaned up after each evaluation. Evaluation has
a ten-second timeout. A mismatch, unexpected compiler/evaluator error, or an
empty runnable selection fails the command.

Fixtures are discovered recursively under `crates/oxc_react_compiler/fixtures`.
Existing exported `FIXTURE_ENTRYPOINT` objects enroll automatically. They support
`fn`, `params`, and optional `sequentialRenders`, following upstream Sprout.
Diagnostic and lint-only fixtures remain covered by the Rust snapshot suite.
Placeholders and runtime limitations are reported separately, with explicit
reasons in `src/selection.ts`. Compiler failures have no expected-failure baseline.

Arrays containing JSX are rendered as React children. The value serializer omits
React's mutable internal state and normalizes function descriptions so parameter
lowering does not create formatting differences. Fixtures can still inspect
function `.length` explicitly. The upstream `@disableNonForgetInSprout` directive
retains its compiled-only behavior.

Ported from `react/react` revision
`cb7c59ecdb7b620ed3d6ce0bf669d7502daedf13`:

- `compiler/packages/snap/src/sprout/` supplies the evaluator and runtime helpers.
- `compiler/packages/snap/src/compiler.ts` supplies the evaluator transform setup.
- `compiler/packages/react-compiler-runtime/src/index.ts` supplies runtime support.

The MIT license and Meta copyright notices are retained. FBT's React element
symbol is adapted in memory; dependency files are not rewritten during install.

import { basename } from "node:path";
import { parse } from "@babel/parser";

const unsupported = new Map([
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
]);

export function exclusion(path: string, source: string): string | null {
  if (/^(error\.|todo\.error)/.test(basename(path))) return "Expected compiler diagnostics";
  const header = source.split("\n", 1)[0]!;
  if (header.includes('@outputMode:"lint"')) return "Lint-only fixture";
  if (header.includes("@flow")) return "Flow is unsupported by the Oxc parser";
  if (!source.includes("FIXTURE_ENTRYPOINT")) return "No entrypoint";
  const ast = parse(source, {
    sourceType: header.includes("@script") ? "script" : "module",
    plugins: ["typescript", "jsx"],
  });
  for (const statement of ast.program.body) {
    if (
      statement.type !== "ExportNamedDeclaration"
      || statement.declaration?.type !== "VariableDeclaration"
    ) {
      continue;
    }
    for (const declaration of statement.declaration.declarations) {
      if (declaration.id.type !== "Identifier" || declaration.id.name !== "FIXTURE_ENTRYPOINT") {
        continue;
      }
      if (
        declaration.init?.type === "ObjectExpression"
        && declaration.init.properties.some(
          (property) =>
            property.type === "ObjectProperty"
            && property.value.type === "StringLiteral"
            && property.value.value === "TodoAdd",
        )
      ) {
        return "Upstream placeholder entrypoint (TodoAdd)";
      }
      return unsupported.get(path) ?? null;
    }
  }
  return "No entrypoint";
}

import { basename } from "node:path";
import { parse } from "@babel/parser";

import { runtimeExclusions } from "./exclusions.ts";

export function exclusion(path: string, source: string): string | null {
  if (/^(error\.|todo\.error)/.test(basename(path))) return "Expected compiler diagnostics";
  const header = source.split("\n", 1)[0]!;
  if (header.includes('@outputMode:"lint"')) return "Lint-only fixture";
  if (header.includes("@flow")) return "Flow is unsupported by the Oxc parser";
  const reason = runtimeExclusions.get(path);
  if (reason !== undefined) return reason;
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
      return null;
    }
  }
  return "No entrypoint";
}

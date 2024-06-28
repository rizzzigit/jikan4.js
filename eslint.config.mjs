import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin-ts";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "@stylistic/ts": stylistic },
  },
  {
    ignores: [
      "**/*.js",
      "**/*.d.ts",
      ".Jikan/*",
      "node_modules/*",
      "dist/*",
      "docs/*",
    ],
  },
  {
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  }
];

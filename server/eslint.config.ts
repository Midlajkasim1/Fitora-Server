import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/explicit-function-return-type": "off",

      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],

      "no-console": "warn",
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "prefer-const": "error"
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", ".tsbuildinfo"]
  }
);
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import n from "eslint-plugin-n";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { n },
    rules: {
      "n/no-process-exit": "error",
      "n/no-extraneous-require": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      eqeqeq: ["error", "always"],
    },
  },
  {
    files: ["*.config.js", "*.config.ts"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: ["node_modules/", "dist/", "coverage/"],
  },
);

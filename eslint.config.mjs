import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  {
    ignores: [
      ".next/**",
      "coverage/**",
      "node_modules/**",
      "dist/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Editorial copy uses apostrophes; escaping hurts readability.
      "react/no-unescaped-entities": "off",
      // Promote common foot-guns from "off" to explicit errors.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
];

export default config;

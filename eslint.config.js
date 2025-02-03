export default [
  {
    ignores: ["node_modules", "dist"], // Ignore unnecessary folders
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      indent: ["error", 2], // Enforce 2-space indentation
      "no-console": "off", // Warn about console.log statements
      "no-unused-vars": "warn", // Warn about unused variables
      quotes: ["error", "double"], // Enforce double quotes
      semi: ["error", "always"], // Enforce semicolons

    },
  },
];
  
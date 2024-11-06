module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
    "plugin:jsdoc/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "import",
    "jest",
    "jsdoc",
    "prefer-arrow",
    "prettier",
    "tsdoc",
  ],
  rules: {
    "prettier/prettier": "error",
    "prefer-arrow/prefer-arrow-functions": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "tsdoc/syntax": "warn", // This enables tsdoc rule syntax checking
  },
  settings: {
    "import/resolver": {
      typescript: {}, // This ensures ESLint can resolve TypeScript paths
    },
  },
};

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    // components/ui: gerado pelo CLI do gluestack-ui (código vendorizado,
    // não autoral) — não faz sentido lintar/formatar como código próprio.
    ignores: ["dist/*", "components/ui/**"],
  }
]);

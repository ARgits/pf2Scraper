import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.{vue,ts}"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error',{'varsIgnorePattern':'^_'}],
      'vue/no-unused-vars':['error',{"ignorePattern":"^_"}],

      "vue/script-indent": ["error", 2, {
        "baseIndent": 0,
        "switchCase": 0,
        "ignores": []
      }]

    }
  },
];
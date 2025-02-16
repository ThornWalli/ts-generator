import globals from 'globals';
// import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintIgnores from './eslint.ignores.js';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslintIgnores,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser }
    },
    rules: {
      'prettier/prettier': 'error'
    }
  }
);
// export default [
//   eslintIgnores,
//   pluginJs.configs.recommended,
//   ...pluginVue.configs['flat/essential'],
//   eslintPluginPrettierRecommended,
//   {
//     languageOptions: {
//       globals: { ...globals.node, ...globals.browser }
//     },
//     rules: {
//       'prettier/prettier': 'error'
//     }
//   },
//   {
//     extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
//     parser: '@typescript-eslint/parser',
//     parserOptions: {
//       project: './tsconfig.json'
//     },
//     root: true,
//     rules: {
//       '@typescript-eslint/no-unused-vars': [
//         'error',
//         {
//           argsIgnorePattern: '^_',
//           varsIgnorePattern: '^_',
//           caughtErrorsIgnorePattern: '^_'
//         }
//       ]
//     }
//   }
// ];

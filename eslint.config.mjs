// import { FlatCompat } from '@eslint/eslintrc';
// import prettierRecommended from 'prettier/recommended';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const eslintConfig = [
  {
    ignores: ['node_modules/**', 'dist/**', 'front/**', '*.mjs', '*.js'],
  },
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default eslintConfig;
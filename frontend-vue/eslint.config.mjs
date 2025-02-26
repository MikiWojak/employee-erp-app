import globals from 'globals';
import eslint from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
// @TODO eslint-plugin-perfectionist

export default [
    eslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['**/*.{js,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser
        },
        rules: {
            'no-unused-vars': 'error',
            'vue/no-unused-vars': 'error',
            'vue/html-indent': ['error', 4, { baseIndent: 1 }],
            'vue/script-indent': ['error', 4, { baseIndent: 0 }],
            'vue/max-attributes-per-line': 'off',
            'vue/html-self-closing': 'off',
            'vue/require-explicit-emits': 'error'
        }
    },
    eslintConfigPrettier
];

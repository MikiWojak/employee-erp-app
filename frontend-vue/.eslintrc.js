module.exports = {
    extends: ['eslint:recommended', 'plugin:vue/recommended'],
    rules: {
        'no-unused-vars': [
            'error',
            { vars: 'all', args: 'after-used', ignoreRestSiblings: true }
        ],
        'vue/html-indent': ['error', 4, { baseIndent: 1 }],
        'vue/script-indent': ['error', 4, { baseIndent: 0 }],
        'vue/max-attributes-per-line': ['off'],
        'vue/html-self-closing': ['off'],
        'vue/multi-word-component-names': ['off']
    },
    parserOptions: {
        sourceType: 'module'
    },
    overrides: [
        {
            files: ['src/**/*'],
            env: {
                browser: true
            }
        }
    ],
    globals: {
        $: true,
        require: true,
        process: true,
        module: true
    },
    env: {
        node: true,
        es2022: true
    }
};

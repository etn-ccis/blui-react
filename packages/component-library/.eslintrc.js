module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['jest-dom', 'testing-library'],
    extends: ['@brightlayer-ui/eslint-config/tsx', 'plugin:react-hooks/recommended'],
    parserOptions: {
        project: './tsconfig.json',
    },
    env: {
        browser: true,
        jest: true,
    },
    rules: {
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
        'no-empty-function': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/prefer-find': 'off',
        '@typescript-eslint/no-base-to-string': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: [
                    'classProperty',
                    'objectLiteralProperty',
                    'typeProperty',
                    'classMethod',
                    'objectLiteralMethod',
                    'typeMethod',
                    'accessor',
                    'enumMember',
                ],
                format: null,
                modifiers: ['requiresQuotes'],
            },
        ],
    },
};

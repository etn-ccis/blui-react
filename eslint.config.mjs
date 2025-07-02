import storybook from "eslint-plugin-storybook";
import bluiRecommended from '@brightlayer-ui/eslint-config';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
    ...bluiRecommended,
    { ignores: ['dist', 'docs/dist/**/**', 'packages/**/dist/**', 'apps/storybook/.storybook'] },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                project: ['./tsconfig.json'],
            },
        },
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off',
            '@typescript-eslint/no-unnecessary-type-arguments': 'off',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-base-to-string': 'off',
            '@typescript-eslint/prefer-find': 'off',
          
        },
    },
    {
        files: ['packages/login-workflows/**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-empty-function': 'off',
            'no-empty-function': 'off',
            'no-empty-object-type': 'off',
            'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
            'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
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
        languageOptions: {
            ecmaVersion: 2020,
        },
    },
    {
        files: ['packages/blui-react-component-library/**/*.{ts,tsx}'],
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    {
        files: ['packages/blui-react-cli-templates/**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
            'no-empty-function': 'off',
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
    },
    ...storybook.configs["flat/recommended"]
];

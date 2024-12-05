// eslint.config.js
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh
        },
        rules: {
            // React plugin rules
            'react/react-in-jsx-scope': 'off', // Not needed in modern React
            'react/prop-types': 'warn',
            'react/no-unescaped-entities': 'warn',

            // React Hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // React Refresh plugin rules
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true }
            ],

            // General ESLint rules
            'no-unused-vars': ['warn', {
                args: 'after-used',
                ignoreRestSiblings: true
            }],
            'no-console': 'warn',
            'eqeqeq': 'error',
            'no-duplicate-imports': 'error'
        }
    }
];
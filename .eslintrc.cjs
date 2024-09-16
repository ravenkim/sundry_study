module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: [
        'eslint:recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            'jsx': true,
        },
    },
    settings: {
        react: { version: '18.2' },
        'import/resolver': {
            'node': {
                'paths': ['src'],
                'extensions': ['.js', '.jsx', '.ts', '.tsx'],
            },
        },

    },

    plugins: ['react-refresh'],
    rules: {
        'no-unused-vars': 'warn',
        'react/jsx-no-target-blank': 'off',
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'react/prop-types': 'off',
        'react-hooks/exhaustive-deps': 'off',


    },
}

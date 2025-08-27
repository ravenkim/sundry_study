module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: {ecmaVersion: 'latest', sourceType: 'module'},
    settings: {react: {version: '18.2'}},
    plugins: ['react-refresh'],
    rules: {
        "react/prop-types": 0,
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        "no-unused-vars": "off"
    },


    // //build 시에 모든 console.log를 제거
    // build: {
    //     minify: 'terser',
    //     terserOptions: {
    //         compress: {
    //             drop_console: true,
    //             drop_debugger: true
    //         }
    //     }
    // }


}

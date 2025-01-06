module.exports = {
    // // 支持最新的最终 ECMAScript 标准
    // // npm i @typescript-eslint/parser -D下载依赖并使用，支持js与ts最新语法的补丁
    // parser: "@typescript-eslint/parser",
    // // import:解决动态导入import语法报错问题 --> 实际使用eslint-plugin-import的规则解决的
    // plugins: ["@typescript-eslint", "import"], 
    // // 继承 Eslint 规则
    extends: ["react-app"], // 继承 react 官方规则
    parserOptions: {
        babelOptions: {
            presets: [
                // 解决页面报错问题
                ["babel-preset-react-app", false],
                "babel-preset-react-app/prod",
            ],
        },
    },
    // env: {
    //     node: true, // 启用node中全局变量
    //     browser: true, // 启用浏览器中全局变量
    // },
    // parserOptions: {
    //     ecmaVersion: 6,
    //     sourceType: "module",
    // },
    rules: {
        "no-var": 1,// 不能使用 var 定义变量,
        "@typescript-eslint/no-unused-vars": 0,
    },
    overrides: [
        {
            files: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx']
        }
    ]
};
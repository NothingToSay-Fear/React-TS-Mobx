module.exports = {
    // // 智能预设：能够编译ES6语法
    // presets: [
    //     [
    //         "@babel/preset-env",
    //         // 过去我们使用 babel 对 js 代码进行了兼容性处理，其中使用@babel/preset-env 智能预设来处理兼容性问题。
    //         // 它能将 ES6 的一些语法进行编译转换，比如箭头函数、点点点运算符等。但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理。
    //         // 所以此时我们 js 代码仍然存在兼容性问题，一旦遇到低版本浏览器会直接报错。所以我们想要将 js 兼容性问题彻底解决
    //         // 按需加载core-js的polyfill
    //         {
    //             useBuiltIns: "usage",
    //             corejs: {
    //                 version: "3",
    //                 proposals: true
    //             }
    //         }
    //     ],
    //     "@babel/preset-react",
    //     "@babel/preset-typescript",
    // ],
    presets: [
        ["react-app",
            {
                runtime: "automatic"
            }]
    ]//react-app包含了core-js的补丁以及@babel/preset-env智能预设
};
// Webpack 是基于 Node.js 运行的，所以采用 Common.js 模块化规范
// Node.js的核心模块，专门用来处理文件路径
const path = require("path");

// Node.js核心模块，os 模块提供了与操作系统交互的API，允许你访问操作系统相关的信息和功能。
const os = require("os");
// cpu核数
const threads = os.cpus().length;
// const threads = 1;


// ESLintWebpackPlugin用来规范代码
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
// 以指定html模板为模板，自动引入js文件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// MiniCssExtractPlugin则会将CSS代码提取到单独的CSS文件中（该css代码是经过css-loader处理的）
// 并将CSS文件链接到HTML页面中的<head>标签中。使用MiniCssExtractPlugin.loader的好处是可以减少HTML文件的大小，使得页面的加载速度更快
// 此外，将CSS代码提取到单独的文件中，可以利用浏览器的缓存机制，使得页面的加载速度更快，并减少了服务器的负载。
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// CssMinimizerPlugin可以优化和压缩 CSS 文件，提高网页的性能
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// TerserPlugin是用于压缩和优化 JavaScript 代码的 Webpack 插件。它使用 Terser（一个 JavaScript 解析器、压缩器、美化器和工具集）来移除未使用的代码、压缩变量名和函数名，以及执行其他优化操作，从而减小打包后的 JavaScript 文件大小
const TerserPlugin = require("terser-webpack-plugin");
// 使用Preload或Prefetch预取和预加载资源文件，提高页面首屏速度
const PreloadWebpackPlugin = require("preload-webpack-plugin");
// React官方提供的热更新插件
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
//
const CopyPlugin = require("copy-webpack-plugin");
// 压缩图片
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
//分析打包耗时插件
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
//分析打包依赖插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
    // use 数组里面 Loader 执行顺序是从右到左
    // css-loader：负责将 Css 文件编译成 Webpack 能识别的模块
    // style-loader：会动态创建一个 Style 标签，里面放置 Webpack 中 Css 模块内容
    return [
        isEnvDevelopment && "style-loader",
        isEnvProduction && {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '../../'
            }
        },
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        preProcessor,
    ].filter(Boolean);
};


module.exports = {
    // 模式
    mode: isEnvDevelopment ? "development" : "production",
    // 配置sorceMap的类型
    // SourceMap（源代码映射）是一个用来生成源代码与构建后代码一一映射的文件的方案
    // 它会生成一个 xxx.map 文件，里面包含源代码和构建后代码每一行、每一列的映射关系。当构建后代码出错了，会通过 xxx.map 文件，从构建后代码出错位置找到映射后源代码出错位置，从而让浏览器提示源代码文件出错位置，帮助我们更快的找到错误根源
    // 开发环境可以使用sourceMap,生产环境建议关掉(有泄露源码风险)
    devtool: isEnvDevelopment ? "cheap-module-source-map" : false,
    // 入口
    // 相对路径和绝对路径都行
    entry: './src/index',
    // 输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: isEnvProduction ? path.resolve(__dirname, "build") : undefined,
        // 生产环境设置为./相对于html文件去取资源，开发环境相对于开发服务器根目录
        publicPath: isEnvProduction ? './' : '/',
        // 动态导入输出资源命名方式
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
        // 图片、字体等资源命名方式（注意用hash）
        assetModuleFilename: "static/media/[name].[hash:8][ext]",
        // filename:输出文件名
        filename: "static/js/[name].[contenthash:8].js",
        // 自动将上次打包目录资源清空
        clean: true
    },
    cache: {
        type: 'filesystem'
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
        alias: {
            '@/components': path.resolve(__dirname, '.', 'src/components'),
            '@/SWMComponents': path.resolve(__dirname, '.', 'src/SWMComponents'),
        }
    },
    // 加载器
    module: {
        rules: [
            {
                oneOf: [{
                    // 用来匹配 .css 结尾的文件
                    test: /\.css$/,
                    use: getStyleLoaders()
                },
                {
                    test: /\.less$/,
                    use: getStyleLoaders("less-loader")
                },
                {
                    test: /\.s[ac]ss$/,
                    use: getStyleLoaders("sass-loader")
                },
                {

                    test: /\.svg$/,
                    use: [
                        {
                            loader: require.resolve('@svgr/webpack'),
                            options: {
                                prettier: false,
                                titleProp: true,
                                ref: true,
                            },
                        }
                    ],
                    issuer: {
                        and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
                    },

                },
                {
                    test: /\.(png|jpe?g|gif|webp)$/,
                    type: "asset",
                    parser: {
                        //设置小于一定大小的图片会被base64处理;
                        //优点是减小了请求资源的数量;
                        //缺点:base64编码后图片比原来大一点,打包后的文件体积会稍微变大,因此只建议较小的图片进行base64处理;
                        dataUrlCondition: {
                            maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
                        }
                    },
                },
                {
                    //type: "asset/resource"和type: "asset"的区别:
                    //type: "asset" 相当于url-loader, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式
                    //type: "asset/resource" 相当于file-loader, 将文件转化成 Webpack 能识别的资源，其他不做处理
                    //设置原样输出的资源，除以下几种类型的文件，其余的都进行原样输出
                    exclude: [/(^|\.(js|mjs|jsx|ts|tsx|html|json))$/],
                    type: "asset/resource"
                },
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    exclude: /node_modules/, // 排除node_modules代码不编译
                    use: [
                        {
                            loader: "thread-loader", // 开启多进程
                            options: {
                                workers: threads, // 数量
                            },
                        },
                        {
                            //babel-loader进行js语法向下兼容
                            loader: "babel-loader",
                            //每次打包时 js 文件都要经过 Eslint 检查 和 Babel 编译，速度比较慢。
                            //我们可以缓存之前的 Eslint 检查 和 Babel 编译结果，这样第二次打包时速度就会更快了
                            options: {
                                cacheDirectory: true, // 开启babel编译缓存
                                cacheCompression: false, // 缓存文件不要压缩
                                //Babel 为编译的每个文件都插入了辅助代码，使代码体积过大！
                                //Babel 对一些公共方法使用了非常小的辅助代码，比如 _extend。默认情况下会被添加到每一个需要它的文件中
                                //具体来说，这个插件会将 Babel 注入的帮助程序代码（helper）和 polyfill 从原来的每个文件都包含一份，改为从一个统一的地方引入。这样，不同的文件就可以共享这些帮助程序和 polyfill，提高了代码的重用性，从而减小了编译后的代码体积
                                //禁用了 Babel 自动对每个文件的 runtime 注入，而是引入 @babel/plugin-transform-runtime 并且使所有辅助代码从这里引用
                                // plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                                //这里注释掉"@babel/plugin-transform-runtime"是因为Babel配置文件设置了"react-app"这个智能预设，该预设已经包含了@babel/plugin-transform-runtime
                                plugins: [
                                    isEnvDevelopment && "react-refresh/babel"  //开启js的HMR功能
                                ].filter(Boolean)
                            }
                        }
                    ]
                },
                ]
            }
        ],
    },
    // 插件
    plugins: [
        isEnvDevelopment &&
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "src"),
            extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
            eslintPath: require.resolve('eslint'),
            exclude: "node_modules",
            cache: true, // 开启缓存
            // 缓存目录
            cacheLocation: path.resolve(
                __dirname,
                "node_modules/.cache/.eslintcache"
            ),
            // threads: threads  // 开启多进程
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "public/index.html"),
        }),
        isEnvDevelopment && new ReactRefreshWebpackPlugin(), // 解决js的HMR功能运行时全局变量的问题
        new PreloadWebpackPlugin({
            //Preload加载优先级高，Prefetch加载优先级低
            //Preload只能加载当前页面需要使用的资源，Prefetch可以加载当前页面资源，也可以加载下一个页面需要使用的资源
            //两者都有浏览器兼容性问题,Preload 相对于 Prefetch 兼容性好一点
            rel: 'preload',
            as: "script"
        }),
        // 提取css成单独文件
        isEnvProduction &&
        new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
            ignoreOrder: true,//忽略因Css引入顺序导致的警告
        }),
        // 将public下面的资源复制到dist目录去（除了index.html）
        isEnvProduction &&
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./public"),
                    to: path.resolve(__dirname, "./build"),
                    toType: "dir",
                    noErrorOnMissing: true, // 不生成错误
                    globOptions: {
                        // 忽略文件
                        ignore: ["**/index.html"],
                    },
                    info: {
                        // 跳过terser压缩js
                        minimized: true,
                    },
                },
            ],
        }),
        new SpeedMeasurePlugin(),
        isEnvProduction &&
        new BundleAnalyzerPlugin({
            openAnalyzer: false, //默认不自动打开浏览器显示打包分析报告
        })
    ].filter(Boolean),
    optimization: {
        minimize: isEnvProduction,
        usedExports: true,
        minimizer: [
            // css压缩也可以写到optimization.minimizer里面，效果与写到plugins一样的
            new CssMinimizerPlugin(),
            // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
            new TerserPlugin({
                parallel: threads // 开启多进程
            }),
            isEnvProduction && new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        encodeOptions: {
                            mozjpeg: {
                                // That setting might be close to lossless, but it’s not guaranteed
                                // https://github.com/GoogleChromeLabs/squoosh/issues/85
                                quality: 100,
                            },
                            webp: {
                                lossless: 1,
                            },
                            avif: {
                                // https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
                                cqLevel: 0,
                            },
                        },
                    },
                },
            })
        ].filter(Boolean),
        splitChunks: {
            chunks: 'all',  //对所有模块都进行分割，将重复的代码，抽离出来作为单独的chunk来引用，减少重复的代码
            cacheGroups: {
                // 将react相关的库单独打包，减少node_modules的chunk体积。
                react: {
                    name: "react",
                    test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
                    chunks: "initial",
                    priority: 20,
                }
            }
        },
        // 当使用contentHash优化文件缓存时，当math.js被入口main文件引用，修改math文件时hash值会变，导致文件名会变，入口main文件对math的引用路径会变，导致main文件的hash值也会变
        // 所以发生了math内容变了，但是main文件实际内容没变，但是导致两个文件的缓存都失效了
        // 正常应该只是math文件缓存失效，main缓存还可以使用
        // 解决方法:将 hash 值单独保管在一个 runtime 文件中
        // 提取runtime文件
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
    },
    // 开启本地开发服务器
    // 并且当你使用开发服务器时，所有代码都会在内存中编译打包，并不会输出到 dist 目录下。
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true,   // 开启HMR功能(只用于开发环境，生成环境不需要),HotModuleReplacement（HMR/热模块替换）：在程序运行中，替换、添加或删除模块，而无需重新加载整个页面
        compress: true,   //启用gizp压缩
        historyApiFallback: true,
        client: {
            overlay: true   //当出现编译错误或警告时，在浏览器中显示全屏覆盖
        }
    },
    // performance属性会在文件打包之后对一些大于一定大小的包发出警告导致打包失败，这里设置false禁用掉这个警告
    performance: false
};
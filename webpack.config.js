const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

// terser-webpack-plugin是Uglify-es单独拉出来的分支来进行维护
const TerserPlugin = require('terser-webpack-plugin');
// 使用交互式可缩放树状图可视化webpack输出文件的大小
const BoundleAnalyZerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// HappyPack——将任务分解成多个子进程，并发执行，子进程结束后，将结果返回给主进程
// 但项目如果非常简单，没有必要采用这种方式，反而浪费cpu资源
// const HappyPack = require('happypack');
// 根据cpu数创建线程池，用多进程实现多线程
// const happyThreadPool = HappyPack.ThreadPool({size: OscillatorNode.cpus().length})

module.exports = {
    optimization: {
        minimizer: [new TerserPlugin({
            cache: true, // 缓存，加快构建速度
            parallel: true, // 开启多线程，加快打包优化
            terserOptions: {
                compress: {
                    unused: true, // 剔除无用代码
                    drop_debugger: true, // 删除debugger代码
                    drop_console: true, // 删除console代码
                    dead_code: true // 删除无用代码
                }
            }
        })]
    },
    // import时，可不用写文件后缀名
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    entry: path.resolve(__dirname, 'src/index.jsx'),
    module: {
        // 配置不解析的文件
        noParse: /node_modules\/(jquery\.js)/,
        rules: [
            // thread-loader——对loader进行优化，放在所有loader之前
            // {
            //     test: /\.js$/,
            //     include: path.resolve('src'),
            //     use: [
            //         'thread-loader'
            //     ]
            // },

            {
                // exclude优先级高于include和test，三者有冲突时，优先exclude
                test: /\.jsx?/, // 即匹配了js文件又匹配了jsx文件
                exclude: /node_modules/, // 将node_modules排除在外，其余文件都要，在编译过程中，不仅编译了自己项目代码，还编译node_modules那么多不是自己写的代码，非常不利于webpack构建性能
                // include: , // 只需要打包这里的文件，更有目标性和针对性
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false, // 没有babelrc文件
                        presets : [
                            require.resolve('@babel/preset-react'),
                            require.resolve('@babel/preset-env', { modules: false })
                            // modules: false -> 模块化方案的一个指定，在编译ES6语法的时候，是否将import语法当做ES6语法进行编译
                            // webpack识别import和export，因为我们已经有了commonJS这个模块化方案，所以我们可以置为false
                        ],
                        // 是否对编译结果做缓存（可不讲）
                        cacheDirectory: true,
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'), // 需要被处理文件路径
            filename: "index.html" // 文件打包完毕之后，目标文件名称
        }),

        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        // 可视化webpack输出文件的大小
        new BoundleAnalyZerPlugin(),
        // new HappyPack({
        //     id: 'jsx',
        //     threads: happyThreadPool,
        //     loaders: ['babel-loader'] // 该loader需要支持HappyPack
        // })
    ],
    devServer: {
        hot: true
    }
}

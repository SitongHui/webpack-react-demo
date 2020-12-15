const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const BoundleAnalyZerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    optimization: {
        minimizer: [new TerserPlugin({
            cache: true, // 缓存，加快构建速度
            parallel: true, // 开启多线程，加快打包优化
            terserOptions: {
                compress: {
                    unused: true, //剔除无用代码
                    drop_debugger: true,
                    drop_console: true,
                    dead_code: true
                }
            }
        })]
    },
    // import时，可不用写文件后缀名
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    entry: path.resolve(__dirname, 'src/index.jsx'),
    mode: 'development',
    module: {
        // 配置不解析的文件
        noParse: /node_modules\/(jquery\.js)/,
        rules: [
            {
                test: /\.jsx?/, // 即匹配了js文件又匹配了jsx文件
                exclude: /node_modules/, // 将node_modules排除在外，在编译过程中，不仅编译了自己项目代码，还编译node_modules那么多不是自己写的代码，非常不利于webpack构建性能
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
        new BoundleAnalyZerPlugin()
    ],
    devServer: {
        hot: true
    }
}

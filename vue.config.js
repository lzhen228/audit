
const path = require('path');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath: '/', // 设置打包文件相对路径
    outputDir: 'dist',
    assetsDir: 'static',
    // lintOnSave: process.env.NODE_ENV === 'development',
    lintOnSave: false,
    productionSourceMap: false,
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config
                .entry('app')
                .clear()
                .add('./src/main.js');           
            config.plugin('html').tap(args => {
                args[0].title = '科学数据安全审计系统';
                args[0].isProd = true;
                return args;
            });
           // 开启图片压缩           
            config
                .entry('app')
                .clear()
                .add('./src/main.js');
            config.plugin('html').tap(args => {
                args[0].title = '科学数据安全审计系统';
                args[0].isProd = false;
                return args;
            });
        });
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config
                .entry('app')
                .clear()
                .add('./src/main.js');
            config.plugin('html').tap(args => {
                args[0].title = '科学数据安全审计系统';
                args[0].isProd = false;
                return args;
            });
        });
    },
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0',
        port: 12937,
        https: false,
        hotOnly: false, // 热更新
        proxy: {
            '/api': {
                target: 'http://159.226.16.34:12938',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    // 如果接口本身没有api的路径，那么这里将发送到后端的请求重写为没有api的路径
                    '^/api': ''
                },

            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
                '_c': resolve('src/components'),
            },
        },
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            // 配置compression-webpack-plugin压缩
            new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8,
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5,
                minChunkSize: 100,
            }),
        ],
    },
}
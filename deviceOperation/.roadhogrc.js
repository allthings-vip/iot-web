// 文档：https://github.com/sorrycc/roadhog

const path = require('path');

export default {
    entry: 'src/index.js',

    extraBabelPlugins: [
        'transform-runtime',
        ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
    ],

    env: {
        development: {
            extraBabelPlugins: [
                'dva-hmr'
            ]
        }
    },

    // 前缀自动补全
    autoprefixer: {
        browsers: ['ie>=8', '>1% in CN']
    },

    // 指定不需要走 CSSModules 的文件列表
    cssModulesExclude: [
        './src/index.less'
    ],

    hash: true,

    publicPath: '/',
    outputPath: './dist/', // 路径不要点号，比如：1.0
    theme: './theme.config.js',
    // proxy: {
    //     '/dos': {
    //         target: 'http://10.77.1.17',
    //         changeOrigin: true,
    //         // pathRewrite: {
    //         //     '^/iov': '',
    //         // }
    //     },
    // }
}

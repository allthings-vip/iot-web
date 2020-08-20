const webpack = require('webpack');

module.exports = function (webpackConfig, env) {
    if (env === 'production') {
        // 上线环境使用分包打包方式  
        webpackConfig.entry = {
            index: './src/index.js',
            vendor: [
                'moment',
                'lodash',
                'react',
                'react-dom'
            ]
        }
        webpackConfig.plugins.push(
            // 抽取出通用的部分
            new webpack.optimize.CommonsChunkPlugin({
                name: ['vendor'],
                filename: '[name].[chunkhash].js',
                minChunks: Infinity,
            }),
            // 避免稍微修改一下入口文件就会改动commonChunk，导致原本有效的浏览器缓存失效
            new webpack.optimize.CommonsChunkPlugin({
                name: 'runtime',
                filename: '[name].[hash].js'
            }),
        )

        // 压缩css
        webpackConfig.module.rules.map(v => {
            if (String(v.test) === '/\\.css$/') {
                if (Array.isArray(v.use)) {
                    v.use.forEach(item => {
                        if (item.loader === 'css') {
                            item.options.minimize = true;
                        }
                    })
                }
            }
        })
        
    }

    webpackConfig.externals = {
        'BMap': 'BMap',
        'BMapLib': 'BMapLib'
    };
    return webpackConfig
}

import { defineConfig } from '@umijs/max';

const webpackConfig = defineConfig({
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.output.chunkFilename('[contenthash:16].js');
      config.merge({
        optimization: {
          minimize: true,
          splitChunks: {
            chunks: 'async',
            minSize: 30000, //文件最小打包体积，单位byte，默认30000，若单个文件不满足会合并其他文件组成一个
            minChunks: 2, //最小使用到次数，超过2次执行
            automaticNameDelimiter: '.', //连接符
            cacheGroups: {
              vendors: {
                // 基本框架
                name: 'vendors',
                test: /[\\/]node_modules[\\/]/,
                // chunks: 'all',
                priority: 10,
              },
              antdesigns: {
                name: 'antdesigns',
                chunks: 'all',
                test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
                priority: 11,
              },
              'async-commons': {
                // 其余异步加载包
                chunks: 'async',
                minChunks: 2,
                name: 'async-commons',
                priority: 9,
              },
              commons: {
                // 其余同步加载包
                chunks: 'all',
                minChunks: 2,
                name: 'commons',
                priority: 8,
              },
              default: {
                name: 'default',
                minChunks: 1,
                priority: -1,
                reuseExistingChunk: true,
              },
            },
          },
        },
      });
      //过滤掉momnet的那些不使用的国际化文件
      config
        .plugin('replace')
        .use(require('webpack').ContextReplacementPlugin)
        .tap(() => {
          return [/moment[/\\]locale$/, /zh-cn/];
        });

      // config.plugin('compression-webpack-plugin').use(require('compression-webpack-plugin'), [
      //   {
      //     test: /\.(js|css|html)$/i, // 匹配
      //     threshold: 1024 * 5, // 超过5k的文件压缩
      //     deleteOriginalAssets: false, // 不删除源文件
      //   },
      // ]);
    }
  },
});

export default webpackConfig;

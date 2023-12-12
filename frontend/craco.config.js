const path = require('path');
const webpack = require('webpack');

module.exports = {
    webpack: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@ui': path.resolve(__dirname, 'src/components/ui'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@db': path.resolve(__dirname, 'src/db'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@layout': path.resolve(__dirname, 'src/layout'),
            '@fonts': path.resolve(__dirname, 'src/fonts'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@widgets': path.resolve(__dirname, 'src/widgets'),
            '@contexts': path.resolve(__dirname, 'src/contexts'),
            '@constants': path.resolve(__dirname, 'src/constants'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@store': path.resolve(__dirname, 'src/store'),
            
        },
        configure: (webpackConfig) => {
          // Add or modify webpack configuration here
          const fallback = webpackConfig.resolve.fallback || {};
          Object.assign(fallback, {
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            assert: require.resolve("assert/"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            os: require.resolve("os-browserify"),
            url: require.resolve("url"),
            zlib: require.resolve('browserify-zlib'),
          });
          webpackConfig.resolve.fallback = fallback;
    
          webpackConfig.plugins = (webpackConfig.plugins || []).concat([
            new webpack.ProvidePlugin({
              process: 'process/browser',
              Buffer: ['buffer', 'Buffer'],
            }),
          ]);
    
          webpackConfig.ignoreWarnings = [/Failed to parse source map/];
    
          webpackConfig.module.rules.push({
            test: /\.(js|mjs|jsx)$/,
            enforce: 'pre',
            loader: require.resolve('source-map-loader'),
            resolve: {
              fullySpecified: false,
            },
          });
    
          return webpackConfig;
        },
        
    }
};
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    server: './src/server/index.js',
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'file-loader',
        options: {
          publicPath(url, resourcePath, context) {
            return path.basename(url, '.ejs');
          },
          outputPath: 'views'
        }
      }
    ],
  },
  target: 'node',
  node: {
    __dirname: false,
  },
  output: {
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    'express': 'express'
  }
};

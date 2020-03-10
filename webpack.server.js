const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: './src/server/index.js',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: false,
              name: '[name].[ext]',
              publicPath(url, resourcePath, context) {
                return path.basename(url, '.ejs');
              },
              outputPath: 'views'
            }
          }
        ],
      }
    ],
  },
};

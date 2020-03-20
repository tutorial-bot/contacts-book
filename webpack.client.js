const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InvalidPathFixPlugin = require('./scripts/InvalidPathFixPlugin');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  devtool: 'source-map',
  entry: ['./src/client/index.js'],
  target: 'web',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist/public'),
  },
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        issuer: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].css',
              publicPath: '/',
              esModule: false,
            },
          },
          'extract-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: [
                ':srcset',
                'img:src',
                'audio:src',
                'video:src',
                'track:src',
                'embed:src',
                'source:src',
                'input:src',
                'object:data',
                'script:src',
                'link:href',
              ],
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: '../views/app.ejs',
      template: 'raw-loader!./src/server/views/app.ejs',
    }),
    new InvalidPathFixPlugin({
      invalidPath: '../public/',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      // cacheGroups: {
        // vendor: {
          // test: /[\\/]node_modules[\\/]/,
        // },
      // },
    },
  },
};

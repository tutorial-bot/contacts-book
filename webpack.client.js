const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InvalidPathFixPlugin = require('./scripts/InvalidPathFixPlugin');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: ['core-js/stable', './src/client/index.js'],
  target: 'web',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist/public'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '../views/app.ejs',
      template: 'raw-loader!./src/server/views/app.ejs',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      },
    }),
    new InvalidPathFixPlugin({
      invalidPath: '../public/',
    }),
  ],
};

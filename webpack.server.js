const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  devtool: 'source-map',
  entry: ['core-js/stable', './src/server/index.js'],
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
        test: /\.js$/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      {
        from: './src/server/views/error.ejs',
        to: './views/error.ejs',
      },
    ]),
    new NodemonPlugin(),
  ],
};

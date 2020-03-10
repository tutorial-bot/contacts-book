const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: './src/client/index.js',
  target: 'web',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'views/app.ejs',
      template: 'raw-loader!./src/server/views/app.ejs',
      interpolate: false,
      interpolate: false,
    }),
  ],
};

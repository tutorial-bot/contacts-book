const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    client: './src/client/index.js',
  },
  target: 'web',
  output: {
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

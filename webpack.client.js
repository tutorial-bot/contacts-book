const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    client: './src/client/index.js',
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
  }
};

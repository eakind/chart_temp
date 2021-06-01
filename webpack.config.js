const webpack = require('webpack');
const path = require('path');
const baseConfig = {
  watch: false,
  mode: 'development',
  name: 'chart',
  entry: './src/index.js',
  output: {
    filename: 'chart.js',
    path: path.resolve(__dirname, 'public'),
    library: 'chart',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    d3: {
      commonjs: 'd3',
      commonjs2: 'd3',
      amd: 'd3',
      root: 'd3'
    }
  },
  devServer: {
    contentBase: './public',
    hot: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [path.resolve(__dirname, 'src')]
    }]
  }
};
module.exports = baseConfig;

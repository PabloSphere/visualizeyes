const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'webpack-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'babel-preset-env', 'es2015', 'stage-2']
            },
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, '.'),
    port: 8080,
    open: true,
    hot: true,
    proxy: {
      '/getdb': 'https://localhost:3000'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}

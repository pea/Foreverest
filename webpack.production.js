const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const SentryCliPlugin = require('@sentry/webpack-plugin')

const stylesheetsLoaders = [{
  loader: 'css-loader',
  options: {
    modules: true,
    localIdentName: '[path]-[local]-[hash:base64:3]',
    sourceMap: true
  }
}]

const stylesheetsPlugin = new ExtractTextPlugin('[hash].css')
const htmlWebpackPlugin = new HtmlWebpackPlugin({ template: 'index.html' })
const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'false')),
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
  }
})
const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
const compressionPlugin = new CompressionPlugin()

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './index',
  output: {
    publicPath: '/',
    filename: '[hash].js',
    path: path.join(__dirname, 'dist')
  },
  devtool: 'cheap-source-map',
  plugins: [
    stylesheetsPlugin,
    htmlWebpackPlugin,
    definePlugin,
    uglifyPlugin,
    compressionPlugin,
    new SentryCliPlugin({
      include: '.',
      ignore: ['node_modules', 'webpack.config.js', 'webpack.production.js'],
      release: 'b5a5780'
    })
  ],
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.html$/,
        loader: 'html-loader'
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: stylesheetsLoaders
        })
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...stylesheetsLoaders, {
            loader: 'sass-loader'
          }]
        })
      }, {
        test: /\.svg$/,
        use: [{
          loader: 'react-svg-loader',
          options: {
            es5: true,
            svgo: {
              plugins: [{
                removeAttrs: { attrs: 'xmlns.*' }
              }]
            }
          }
        }]
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  }
}

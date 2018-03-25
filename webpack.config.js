const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlWebpackPlugin = new HtmlWebpackPlugin({ template: 'index.html' })
const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'true'))
});

const stylesheetsLoaders = [
  { loader: 'style-loader' },
  { loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: '[path]-[local]-[hash:base64:3]',
      sourceMap: true
    }
  }
];

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './index',
  output: {
    filename: '[hash].js'
  },
  devtool: 'source-map',
  plugins: [htmlWebpackPlugin, definePlugin],
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
        use: stylesheetsLoaders
      }, {
        test: /\.scss$/,
        use: [...stylesheetsLoaders, {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }]
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

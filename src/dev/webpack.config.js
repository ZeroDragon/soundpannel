const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    vendors: [
      'vue'
    ],
    bundle: path.join(__dirname, '../app/main.js')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../../dist/scripts/')
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'initial',
          test: 'vendors',
          name: 'vendors',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({})
  ]
}

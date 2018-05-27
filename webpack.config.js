const webpack = require('webpack')
const path = require('path')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = env => {
  const isProd = env.NODE_ENV === 'production'
  const distDir = isProd ? '/dist' : '/dist-dev'

  console.log(isProd, distDir)

  const cfg = {
    mode: isProd ? 'production' : 'development',

    entry: ['./src/main.js'],

    output: {
      path: __dirname + distDir,
      publicPath: '/',
      filename: 'js/main.js'
    },

    resolve: {
      extensions: ['*', '.js', '.jsx']
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' }
        },
        {
          test: /\.(scss|sass)$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.modernizrrc.js$/,
          loader: 'modernizr-loader'
        },
        {
          test: /\.modernizrrc(\.json)?$/,
          loader: 'modernizr-loader!json-loader'
        },
        {
          test: /\.(glsl|frag|vert|vs|fs|txt|html)$/,
          use: 'raw-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(glsl|frag|vert|vs|fs)$/,
          loader: 'glslify-loader',
          exclude: /node_modules/
        }
      ]
    },

    performance: { hints: false },

    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      })
    ]
  }

  if (isProd) {
    cfg.optimization = {
      minimize: isProd,
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  } else {
    cfg.entry.unshift('react-hot-loader/patch')
    cfg.plugins.push(new webpack.HotModuleReplacementPlugin())
    cfg.devServer = {
      contentBase: `.${distDir}`,
      hot: true,
      port: env.PORT || 8080
    }
  }

  return cfg
}

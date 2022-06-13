const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src','index.js'),
    watchOptions: {
      ignored: /node_modules/,
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'meowsweeper.js'
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.css$/i,
          loader: "style-loader",
        },
        {
          test: /\.css$/i,
          loader: "css-loader",
          options: {
            url: false
          }
        },
        {
          test: /\.(jsx|js)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  "targets": "defaults" 
                }],
                '@babel/preset-react'
              ]
            }
          }]
        },
        {
          test: /\.(png|jpg|gif)$/i,
          type: 'asset/source',
        }
      ]
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "./src/index.html", to: "./index.html" },
        ],
      }),
    ],
    resolve: {
      extensions: ['', '.js', '.jsx', '.css'],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
    }
  }
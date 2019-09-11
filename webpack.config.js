const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const path = require("path");
const srcPath = path.join(__dirname, "src");
const modulePath = path.join(__dirname, "node_modules");
const distPath = path.join(__dirname, "dist");

module.exports = {
  output: {
    path: distPath,
    publicPath: "/",
    filename: "[name].[hash].js"
  },
  resolve: {
    extensions: [".js", ".mjs", ".jsx", ".css", ".scss", ".png", ".jpg", ".svg", ".ico"],
    alias: {
      "react": path.resolve("node_modules/react"),
      "react-dom": path.resolve("node_modules/react-dom"),
      "/^monaco-editor/": "monaco-editor/esm/vs/editor/editor.api.js",
      "@src": path.resolve(__dirname, "src")
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "css-hot-loader",
          "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.scss$/,
        include: srcPath,
        use: [
          { loader: "css-hot-loader" },
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
          { loader: "postcss-loader" }
        ]
      },
      {
        test: /\.less$/,
        include: modulePath,
        use: ["less-loader"],
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "dist/index.html",
      filename: "./index.html"
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require("autoprefixer")
        ]
      },
    }),
    new MonacoWebpackPlugin({
      languages: [
        "yaml",
        "json"
      ],
      features: [
        "coreCommands",
        "folding",
        "bracketMatching",
        "clipboard",
        "find",
        "colorDetector",
        "codelens"
      ]
    }),
  ],
  devServer: {
    port: 8072,
    hot: true,
    hotOnly: true,
    host: "0.0.0.0",
    historyApiFallback: {
      verbose: true,
      disableDotRule: true
    }
  }
};
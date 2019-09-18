const path = require("path")
const webpack = require('webpack');
const ReplacePlugin = require("webpack-plugin-replace");
const appEnv = process.env.KURL_ENV;

module.exports = {
  entry: {
    bundle: path.join(__dirname, "./src/index.ts"),
  },

  output: {
    filename: `bundle-${process.env.KURL_ENV}.js`,
    path: path.join(__dirname, "dist"),
  },

  mode: process.env.NODE_ENV || "development",

  plugins: [
    new ReplacePlugin({
      exclude: [
        /node_modules/,
      ],
      values: {
        '__BACKEND__': appEnv === "staging" ? "https://backend.staging.kurl.sh" : "https://backend.kurl.sh",
        '__FRONTEND__': appEnv === "staging" ? "https://kurlsh-staging.netlify.com" : "https://kurlsh.netlify.com",
      },
    }),
  ],

  watchOptions: {
    ignored: /node_modules|dist|\.js/g,
  },

  devtool: "cheap-module-source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    plugins: [],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
      },
    ],
  },
}

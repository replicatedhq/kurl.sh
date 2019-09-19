const path = require("path")
const webpack = require('webpack');
const ReplacePlugin = require("webpack-plugin-replace");
const appEnv = process.env.KURL_ENV;

var backend;
var frontend;

if (appEnv === "dev") {
  backend = "https://backend.staging.kurl.sh";
  frontend = "https://kurlsh-staging.netlify.com";
} else if (appEnv === "staging") {
  backend = "https://backend.staging.kurl.sh";
  frontend = "https://kurlsh-staging.netlify.com";
} else if (appEnv === "prod") {
  backend = "https://backend.kurl.sh";
  frontend = "https://kurlsh.netlify.com";
}

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
        '__BACKEND__': backend,
        '__FRONTEND__': frontend,
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

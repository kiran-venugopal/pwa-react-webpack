const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// const CopyPlugin = require("copy-webpack-plugin");
const { InjectManifest, GenerateSW } = require("workbox-webpack-plugin");

module.exports = (_, argv) => {
  const isDevelopment = argv.mode !== "production";
  console.log({ isDevelopment });

  return {
    entry: {
      main: "/src/index.js",
    },
    output: {
      path: path.join(__dirname, "build"),
      publicPath: "/",
      filename: "[name].[contenthash].js",
      clean: true,
    },
    mode: process.env.NODE_ENV || "development",
    resolve: { extensions: [".js", "jsx", ".css"] },

    devServer: {
      host: "localhost",
      port: process.env.PORT || 3000,
      open: false,
      hot: true,
      liveReload: false,
      static: [
        {
          directory: path.join(__dirname, "service-worker"),
        },
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "esbuild-loader",
          options: {
            loader: "jsx",
            target: "es2015",
            jsx: "automatic",
          },
        },
        // {
        //   test: /\.?js$/,
        //   exclude: /node_modules/,
        //   use: {
        //     loader: "babel-loader",
        //     options: {
        //       presets: ["@babel/preset-env", "@babel/preset-react"],
        //     },
        //   },
        // },
        {
          test: /\.(css|scss)$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      isDevelopment && new ReactRefreshPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
        chunks: ["main"],
      }),

      !isDevelopment &&
        new InjectManifest({
          swSrc: "./service-worker/SW.js",
          swDest: "SW.js",
        }),
    ].filter(Boolean),
  };
};

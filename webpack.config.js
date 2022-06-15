const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    album: "./src/client/js/album.js",
    headerNav: "./src/client/js/headerNav.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
  },
  mode: "development",
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 2000,
    poll: 1000,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ], 
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '/[name].[contenthash].[ext]',
            outputPath:'imgs',
            publicPath: 'assets',
          },
        },
      },
    ],
  },
};
const CracoLessPlugin = require("craco-less");
const cracoEsbuildPlugin = require("craco-esbuild");

module.exports = {
  plugins: [
    {
      plugin: cracoEsbuildPlugin,
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // "@primary-color": "#1DA57A"
              // "@link-color": "#636363",
              // "@font-family": "'Noto Sans Korean', 'Malgun Gothic', Dotum ,Helvetica,AppleSDGothicNeo,sans-serif",
              // "@text-color": "#444",
              // "@pagination-item-bg-active": "#394dfb",
              // "@pagination-item-disabled-color-active": "#fff",
              // "@tree-directory-selected-bg": "#f7f9fd",
              // "@tree-directory-selected-color": "#000",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  // webpack: {
  //   module: {
  //     strictExportPresence: true,
  //     rules: [
  //       { parser: { requireEnsure: false } },
  //       {
  //         test: /\.js$/,
  //         exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
  //         loader: "babel-loader",
  //       },
  //     ],
  //   },
  //   plugins: [
  //     new this.webpack.ProvidePlugin({
  //       "window.Quill": "quill",
  //     }),
  //   ],
  // },
};

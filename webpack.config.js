const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === "production";
const analyzeBundle = process.env.ANALYZE === "true";

module.exports = {
  context: __dirname,
  mode: isProd ? "production" : "development",
  entry: {
    app: "./src/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProd ? "[name].[contenthash].js" : "[name].[hash].js"
  },
  devtool: isProd ? "source-map" : "eval-source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {
          // We use ForkTsCheckerWebpackPlugin for typechecking
          transpileOnly: true
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings in dev and extract it to
          // another file in production
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "@teamsupercell/typings-for-css-modules-loader",
            options: {
              banner: "// autogenerated by typings-for-css-modules-loader.",
            }
          },
          // Translates CSS into CommonJS with modules
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "local",
                localIdentName: '[local]--[hash:base64:6]',
                //exportLocalsConvention: 'camelCase'
              },
            }
          },
          // Compiles Sass to CSS
          "sass-loader"
        ]
      }
    ]
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 9000,
    hot: true,
    historyApiFallback: true,
    //overlay: true,
    //stats: "minimal"
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new webpack.WatchIgnorePlugin({ paths : [/s[ac]ss\.d\.ts$/]}),
    new HtmlWebpackPlugin({ template: "index.html" }),
    new ForkTsCheckerWebpackPlugin({
      // For the dev server overlay to work
      async: false
    }),
    new CleanWebpackPlugin(),
    isProd ? false : new webpack.HotModuleReplacementPlugin(),
    analyzeBundle ? new BundleAnalyzerPlugin() : false,
    new MiniCssExtractPlugin({
      filename: isProd ? "[name]-[contenthash].css" : "[name].css"
    }),
  ].filter(Boolean)
};
const path = require("path");
//const webpack = require("webpack");
//const dotenv = require("dotenv").config();
//https://infi.nl/nieuws/development-in-react-using-typescript-and-webpack/

const HTMLWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var outputFilename = "index.js";

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        filename: outputFilename,
    },
    plugins: [
        // Suggested for hot-loading
        /*/new webpack.NamedModulesPlugin(),*/
        // Prevents compilation errors causing the hot loader to lose state
        /*new webpack.NoEmitOnErrorsPlugin(),*/
        /*new webpack.DefinePlugin({
            "process.env": JSON.stringify(dotenv.parsed)
        }),*/
        new HTMLWebpackPlugin({
            // Use this template to get basic responsive meta tags
            template: "public/index.html",
            // inject details of output file at end of body
            inject: "body"
        }),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessor: require('cssnano'),
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          canPrint: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].min.css',
            allChunks: true
        }),
    ],
    resolve: {
        modules: [path.join(__dirname, "app"), "node_modules"],
        extensions: [".js", ".ts", ".tsx", ".scss", ".png"]
    },
    module: {
        rules: [
            /*{
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },*/
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader',
                options: {
                    useBabel: true,
                },
            },
            {
                test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: [/node_modules/],
                loader: "file-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: [/node_modules/],
                loader: "file-loader"
            },
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    }
};

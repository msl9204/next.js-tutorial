const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",

    resolve: {
        extensions: [".js", ".json", ".jsx", ".css"],
    },

    entry: {
        app: "./src/index.jsx",
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                    plugins: ["react-hot-loader/babel"],
                },
                exclude: /node_modules/,
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            // index.html 템플릿을 기반으로 빌드 결과물을 추가해줌
            template: "./public/index.html",
        }),
        new ErrorOverlayPlugin(),
    ],

    devServer: {
        index: "index.html",
        compress: true,
        port: 3000,
        host: "0.0.0.0", // localhost 외 환경에서 사용
    },
};

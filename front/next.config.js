// const CompressPlugin = require("compression-webpack-plugin"); // gzip으로 만들어줌
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
    compress: true,
    webpack(config, { webpack }) {
        const prod = process.NODE_ENV === "production";
        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(
                /moment[/\\]locale$/,
                /^\.\/ko$/
            ),
        ];

        return {
            ...config,
            mode: prod ? "production" : "development",
            devtool: prod ? "hidden-source-map" : "eval",
            plugins,
        };
    },
});

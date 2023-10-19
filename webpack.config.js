const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
    console.log(env);

    return {
        mode: env.production ? "production" : "development",
        entry: path.resolve(__dirname, "./src/main.js"),
        output: {
            path: path.resolve(__dirname, "./dist/"),
            filename: "bundle.[contenthash].js",
            clean: true,
            assetModuleFilename: path.join('./images/[name].[contenthash][ext]'),
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpg|jpeg|gif|JPG)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.svg$/,
                    type: 'asset/resource',
                    generator: {
                        filename: path.join('./icons/', '[name].[contenthash][ext]'),
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "./src/templates/index_template.html"),
                filename: path.resolve(__dirname, './index.html'), // путь и название выходного файла
            })
        ]
    }
}
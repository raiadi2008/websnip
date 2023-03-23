const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: "cheap-module-source-map",
    entry: {
        devtools: path.resolve(__dirname, 'src/devtools/devtools.tsx'),
        background: path.resolve(__dirname, 'src/background/background.ts')
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.tsx?$/,
                exclude: /node_modules/,
            },
            {
                use: ['style-loader', 'css-loader'],
                test: /\.css$/i
            },
            {
                use: ["asset/resource"],
                test: /\.(jpg|jpeg|png|woff|woff2|ttf|svg)$/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/static'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        ...getHtmlPlugins([
            'devtools'
        ])
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    }
}

function getHtmlPlugins(chunks) {
    return chunks.map((value) => new HtmlPlugin({
        title: "Websnip by hyprnest",
        filename: `${value}.html`,
        chunks: [value]
    }))
}
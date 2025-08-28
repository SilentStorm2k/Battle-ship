const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: './src/ts/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // options are picked from babel.config.js
                        // can optionally add them here to but consider adding them to the config file
                    },
                },
                // use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.mjs', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
        }),
        new ESLintPlugin({
            context: path.resolve(__dirname, 'src'),
            files: '**/*.ts', // for TS files specifically
            extensions: ['ts', 'tsx', 'js', 'jsx'],
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, 'tsconfig.json'),
                // You can specify the language service or typescript path if needed
                // diagnosticOptions: {
                //   syntactic: true,
                //   semantic: true,
                //   global: false,
                // },
                // mode: 'write-references', // or 'write-references' for incremental builds
            },
            async: true,
        }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};

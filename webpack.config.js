const path = require('path');
const HtmlWebpackPlugins = require('html-webpack-plugin');


module.exports = {

    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'

    },
    devServer: {

        contentBase: './dist'
    },

    plugins: [
        new HtmlWebpackPlugins({

            filename: 'index.html',
            template: './src/index.html'
        })

    ],

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }


};
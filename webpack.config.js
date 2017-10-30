const path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        path.join(__dirname, 'src', 'index'),
        path.join(__dirname, 'src', 'layout.scss'),
    ],
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'
            },
            // {
            //     test: /\.scss$/,
            //     // use: ['handlebars-loader', 'css-loader', 'sass-loader'],
            //     use: ['style-loader', 'css-loader', 'sass-loader'],
            // },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("bundle.css")
    ]
};

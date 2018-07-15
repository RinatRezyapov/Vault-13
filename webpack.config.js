var webpack = require('webpack');

module.exports = {
    entry: {
        "main": "./src/main.tsx"
    },
    output: {

    },
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          }
        ]
      },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devServer: {
        contentBase: './dist'
    }
};

const path = require('path');

module.exports = {
  entry: {
    "main": "./src/main.ts"
  },
  output: {

  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader?name=/img/[name].[ext]"
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  }
};

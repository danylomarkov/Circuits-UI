var path = require("path");

module.exports = {
  entry: "./app/javascripts/application.js",
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.scss$/,      loaders: ["style", "css", "sass"] },
	    { test: /\.html/,       loader: 'file?name=[name].[ext]' },
      { test: /\.(jpg|png)$/, loader: 'url-loader?limit=100000' },
      { test: /\.otf/,        loader: "file-loader" },
	    {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { presets: ['es2015-webpack'] }
      },
      {
        test: require.resolve('jsplumb'),
        loaders: [
          'imports?this=>window',
          'script'
        ]
      }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./node_modules")]
  }
};

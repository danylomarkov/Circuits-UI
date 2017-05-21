const path = require('path')

// Hack for Ubuntu on Windows: interface enumeration fails with EINVAL, so return empty.
try {
  require('os').networkInterfaces()
} catch (e) {
  require('os').networkInterfaces = () => ({})
}

module.exports = {
  entry: './app/javascripts/application.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  watchOptions: {
    poll: true
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            query: {
              includePaths: [path.resolve(__dirname, './node_modules')]
            }
          }
        ]
      },
      { test: /\.html/, loader: 'file?name=[name].[ext]' },
      { test: /\.(jpg|png)$/, loader: 'url-loader?limit=100000' },
      { test: /\.otf/, loader: 'file-loader' },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: { presets: ['es2015-webpack'] }
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true
            }
          }
        ]
      }
    ]
  }
}

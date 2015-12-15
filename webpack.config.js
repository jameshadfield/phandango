var path = require('path');
var webpack = require('webpack');

module.exports = {
  // context: path.join(__dirname, 'dev'),
  // entry: All modules are loaded upon startup. The last one is exported.
  entry: [
    './js/app',
  ],
  debug: false,
  output: {
    publicPath: 'dist/',
    path: path.join(__dirname, 'dist'),
    filename: 'jscandy.js',
  },
  plugins: [
    new webpack.DefinePlugin({ // MUST BE FIRST!
      'process.env': {
        'NODE_ENV': '"production"',
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        // to avoid having a .babelrc write the presets like this:
        loaders: [ 'babel?presets[]=es2015&presets[]=react' ],
        // note we can't have queries as there are multiple loaders
        include: path.join(__dirname, 'js'),
      }, {
        test: /\.css?$/,
        loaders: [ 'style', 'raw' ],
        include: __dirname,
      },
    ],
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    fallback: path.join(__dirname, 'node_modules'),
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  exclude: path.resolve(__dirname, 'node_modules'),
};

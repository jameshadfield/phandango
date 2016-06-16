var path = require('path');
var webpack = require('webpack');

module.exports = {
  // context: path.join(__dirname, 'dev'),
  // entry: All modules are loaded upon startup. The last one is exported.
  entry: [
    'babel-polyfill',
    './js/containers/app',
  ],
  debug: false,
  output: {
    publicPath: 'dist/',
    path: path.join(__dirname, 'dist'),
    filename: 'phandango.js',
  },
  plugins: [
    new webpack.DefinePlugin({ // MUST BE FIRST!
      'process.env': {
        'NODE_ENV': '"production"',
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/mishoo/UglifyJS2#usage
      sourceMap: true, // only for display during compilation i think
      mangle: true, // 890kb -> 580kb
      compressor: { // these are only minor size savings
        warnings: false,
        sequences: true,
        conditionals: true,
        unused: true,
        if_return: true,
        drop_console: true,
        dead_code: true,
        drop_debugger: true,
        unsafe: false, // would save 1kb
      },
      minimize: true,
      'screw-ie8': true,
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        // to avoid having a .babelrc we can write
        // loaders: [ 'babel?presets[]=es2015&presets[]=react' ],
        // but we need the .babelrc for mocha, so
        loaders: [ 'babel' ],
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

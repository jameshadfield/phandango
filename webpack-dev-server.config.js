var webpack = require('webpack');
var sourceConfig = require('./webpack.config');
sourceConfig.debug = true;
sourceConfig.devtool = '#eval-source-map';
sourceConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server');
// sourceConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin()); // use --hot instead
sourceConfig.plugins[0] = new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': '"development"' } });
sourceConfig.plugins.pop(); // remove the minimize bit
sourceConfig.module.loaders[0].loaders.unshift('react-hot');
sourceConfig.devServer = {
  historyApiFallback: true,
};
module.exports = sourceConfig;

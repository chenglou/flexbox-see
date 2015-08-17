var webpack = require('webpack');

var loaders = ['babel'];
var port = process.env.PORT || 3000;

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];
var entry = {
  src: './src/index.jsx',
};

if (process.env.NODE_ENV === 'development') {
  devtool = 'eval-source-map';
  loaders = ['react-hot'].concat(loaders);
  plugins = plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ]);
  entry = Object.keys(entry).reduce(function (result, key) {
    result[key] = [
      'webpack-dev-server/client?http://0.0.0.0:' + port,
      'webpack/hot/only-dev-server',
      entry[key]
    ];
    return result;
  }, {});
} else {
  plugins = plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
}

module.exports = {
  entry: entry,
  output: {
    filename: '[name]/all.js',
    publicPath: '/',
    path: __dirname,
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: loaders
    }],
    preLoaders: [
      {test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/},
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: plugins,
  eslint: {configFile: '.eslintrc'}
};

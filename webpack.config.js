// webpack.config.js
module.exports = {
  // entry point of our application
  entry: './resources/standalone/notify.js',
  // where to place the compiled bundle
  output: {
    path: './build/js/',
    filename: 'notify_standalone.js'
  }
}

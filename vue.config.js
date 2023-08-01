module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH +'/',
  // Updates the JS filenames.
  configureWebpack: (config) => {
    config.output.filename = 'js/[name].insights.min.js'
    config.output.chunkFilename = 'js/[name].insights.min.js'
  },
  // Updates the CSS filenames.
  css: {
    extract: {
      filename: 'css/[name].insights.css',
      chunkFilename: 'css/[name].insights.css',
    },
  },
}
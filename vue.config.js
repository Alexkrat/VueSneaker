const { defineConfig } = require('@vue/cli-service')

module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'src/index.html',
      // output as dist/index.html
      filename: 'index.html'
    }
  }
}

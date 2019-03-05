const webpack = require('webpack')
const webpackconfig = require('./webpack.config')
const { promisify } = require('util')

const webpackAsync = promisify(webpack)

const bundleScripts = async () => {
  return webpackAsync(webpackconfig)
    .then(({ compilation }) => {
      if (compilation.errors.length > 0) {
        compilation.errors.forEach(err => {
          console.log(err.toString())
        })
        process.exit(1)
      }
    })
}

(async () => {
  await bundleScripts()
})()

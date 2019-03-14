const { app } = require('electron')
const fs = require('fs-extra')
const AdmZip = require('adm-zip')
const path = require('path')
const request = require('request')

const createUUID = () => {
  var dt = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

const download = (url, cb) => {
  const zipFile = path.join('/tmp', `update${createUUID()}.zip`)
  const stream = request(url).pipe(fs.createWriteStream(zipFile))
  stream.on('finish', () => {
    extract(zipFile, cb)
  })
}

const extract = (zipFile, cb) => {
  const zip = new AdmZip(zipFile)
  const containerName = `update${createUUID()}`
  zip.extractEntryTo('Sound Pannel-darwin-x64/Sound Pannel.app/Contents/Resources/app/', path.join('/tmp', containerName), true, true)
  fs.copy(path.join('/tmp', `${containerName}/Sound Pannel-darwin-x64/Sound Pannel.app/Contents/Resources/app/`), app.getAppPath())
  cb(null)
}

const checker = (cb) => {
  updater(cb, false)
}

const updater = (cb, proceed) => {
  const server = 'https://soundpannel.now.sh/'
  const feed = `${server}update/${process.platform}/${app.getVersion()}`
  request({
    url: feed,
    method: 'get',
    json: true
  }, (err, _response, body) => {
    if (err) return cb(null, false)
    if (body === undefined) return cb(null, false)
    if (proceed) return download(body, cb)
    cb(null, true)
  })
}

exports.updater = updater
exports.checker = checker

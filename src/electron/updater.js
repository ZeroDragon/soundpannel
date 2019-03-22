const { app } = require('electron')
const request = require('request')

const updater = cb => {
  const server = 'https://soundpannel.now.sh/'
  const feed = `${server}update/${process.platform}/${app.getVersion()}`
  request({
    url: feed,
    method: 'get',
    json: true
  }, (err, _response, body) => {
    if (err) return cb(err, null)
    if (body === undefined) return cb(null, false)
    cb(null, true)
  })
}

exports.updater = updater

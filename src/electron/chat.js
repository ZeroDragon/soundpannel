const youtube = require('./youtubeMiner')
const discord = require('./discordMiner')
const { join } = require('path')
const { readFileSync } = require('fs')
const { app } = require('electron')
const clone = obj => JSON.parse(JSON.stringify(obj))

let json
try {
  const path = join(app.getPath('userData'), 'settings.json')
  json = JSON.parse(readFileSync(path, { encoding: 'utf8' }))
} catch (_error) {
  json = {}
}

const youtubeMessages = youtube.start(json)
const discordMessages = discord.start(json)

module.exports = () => {
  return Object.assign(
    clone(discordMessages),
    clone(youtubeMessages)
  )
}

const { EventEmitter } = require('events')
const { join } = require('path')
const { readFileSync } = require('fs')
const { app } = require('electron')
const Discord = require('./discordMiner')
const Youtube = require('./youtubeMiner')

let json
try {
  const path = join(app.getPath('userData'), 'settings.json')
  json = JSON.parse(readFileSync(path, { encoding: 'utf8' }))
} catch (_error) {
  json = {}
}

console.log(json)

class Chat extends EventEmitter {
  constructor(json) {
    super()
    this.json = json
    this.getLive()
  }

  getLive() {
    const discord = new Discord(json)
    const youtube = new Youtube(json)
    const emmitMessage = message => this.emit('message', message)
    discord.on('message', emmitMessage)
    youtube.on('message', emmitMessage)
  }
}

module.exports = Chat

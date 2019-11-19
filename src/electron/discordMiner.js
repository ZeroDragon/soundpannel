const DiscordJS = require('discord.js')
const { EventEmitter } = require('events')

class Discord extends EventEmitter {
  constructor({ discordChannel, discordToken }) {
    super()
    this.token = discordToken
    this.channel = discordChannel
    this.getLive()
  }

  getLive() {
    if (this.token == null || this.token === '') return
    if (this.channel == null || this.channel === '') return
    const client = new DiscordJS.Client()
    client.login(this.token)
    client.on('message', msg => {
      if (msg.channel.name !== this.channel) return
      const message = {
        key: `discord-${msg.id}`,
        value: {
          timestamp: new Date(msg.createdTimestamp),
          author: msg.author.username,
          source: 'discord',
          message: msg.content
        }
      }
      this.emit('message', message)
    })
  }

}

module.exports = Discord

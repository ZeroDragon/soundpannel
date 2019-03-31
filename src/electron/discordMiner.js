const Discord = require('discord.js')
const client = new Discord.Client()

let brain = {}
let token = null
let channel = null

client.on('message', msg => {
  if (channel == null) return
  if (msg.channel.name !== channel) return
  const message = {
    key: `discord-${msg.id}`,
    value: {
      timestamp: new Date(msg.createdTimestamp),
      author: msg.author.username,
      source: 'discord',
      message: msg.content
    }
  }
  brain[message.key] = message
  const size = Object.keys(brain).length
  console.log(`discord size: ${size}`)
})

exports.start = settings => {
  token = settings.discordToken
  channel = settings.discordChannel
  if (token != null) client.login(token)
  return brain
}

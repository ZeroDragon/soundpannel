var WebSocketClient = require('websocket').client
const { EventEmitter } = require('events')

class YouTube extends EventEmitter {
  constructor({ restreamToken }) {
    super()
    this.token = restreamToken
    this.getLive()
  }

  getLive() {
    if (this.token == null || this.token === '') return
    var client = new WebSocketClient()
    client.on('Restream: connectFailed', function (error) {
      console.error('Connect Error: ' + error.toString())
    })

    client.on('connect', connection => {
      connection.on('error', function (error) {
        console.error("Restream: Connection Error: " + error.toString())
      })
      connection.on('close', function () {
        console.log('Restream: echo-protocol Connection Closed')
      })
      connection.on('message', payload => {
        if (payload.type === 'utf8') {
          const parsed = JSON.parse(payload.utf8Data)
          if (parsed.event === 'message') {
            const msg = parsed.data
            const message = {
              key: `youtube-${msg.timestamp}`,
              value: {
                timestamp: new Date(msg.timestamp),
                author: msg.author,
                source: 'youtube',
                message: msg.contents
                  .filter(i => i.type === 'text')
                  .map(i => i.content)
                  .join(' ')
              }
            }
            this.emit('message', message)
          }
        }
      })
    })

    client.connect(
      `wss://webchat-backend.restream.io/ws?tokenId=${this.token}`,
      null,
      {
        headers: {
          'Sec-WebSocket-Protocol': 'echo-protocol'
        }
      }
    )
  }

}

module.exports = YouTube

const request = require('request')
const { EventEmitter } = require('events')

class YouTube extends EventEmitter {
  constructor({ youtubeChannel, youtubeKey }) {
    super()
    this.id = youtubeChannel
    this.key = youtubeKey
    this.lastRead = 0
    this.getLive()
  }

  getLive() {
    if (this.key == null || this.key === '') return
    if (this.id == null || this.id === '') return

    const url = 'https://www.googleapis.com/youtube/v3/search' +
      '?eventType=live' +
      '&part=id' +
      `&channelId=${this.id}` +
      '&type=video' +
      `&key=${this.key}`
    this.request(url, data => {
      if (!data.items[0]) {
        setTimeout(() => {
          console.log('Live not found, cooldown for 10s')
          this.getLive()
        }, 10000)
      } else {
        this.liveId = data.items[0].id.videoId
        this.getChatId()
      }
    })
  }

  getChatId() {
    if (!this.liveId) return this.emit('error', 'Live id is invalid.')
    const url = 'https://www.googleapis.com/youtube/v3/videos' +
      '?part=liveStreamingDetails' +
      `&id=${this.liveId}` +
      `&key=${this.key}`
    this.request(url, data => {
      if (!data.items.length) {
        console.log('Chat id not found, cooldown for 10s')
        setTimeout(() => {
          this.getLive()
        }, 10000)
      } else {
        this.chatId = data.items[0].liveStreamingDetails.activeLiveChatId
        this.listen(5000)
      }
    })
  }

  getChat() {
    if (!this.chatId) return this.emit('error', 'Chat id is invalid.')
    const url = 'https://www.googleapis.com/youtube/v3/liveChat/messages' +
      `?liveChatId=${this.chatId}` +
      '&part=id,snippet,authorDetails' +
      '&maxResults=2000' +
      `&key=${this.key}`
    this.request(url, data => {
      data.items.forEach(item => {
        let time = new Date(item.snippet.publishedAt).getTime()
        if (this.lastRead < time) {
          this.lastRead = time

          const message = {
            key: `youtube-${item.id}`,
            value: {
              timestamp: new Date(item.publishedAt),
              author: item.authorDetails.displayName,
              source: 'youtube',
              message: item.snippet.displayMessage
            }
          }

          this.emit('message', message)
        }
      })
    })
  }

  request(url, callback) {
    request({
      url: url,
      method: 'GET',
      json: true,
    }, (error, response, data) => {
      if (error) console.error(error)
      else if (response.statusCode !== 200) console.error(data)
      else callback(data)
    })
  }

  listen(delay) {
    this.getChat()
    this.interval = setTimeout(() => {
      this.stop()
      this.listen(delay)
    }, delay)
  }

  stop() {
    clearTimeout(this.interval)
  }

}

module.exports = YouTube

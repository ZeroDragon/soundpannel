const request = require('request')
const cheerio = require('cheerio')

let brain = {}
let channel = null

const getYoutubeChat = () => {
  if (channel == null) return
  request({
    url: `https://www.youtube.com/live_chat?is_popout=1&v=${channel}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
    }
  }, (_err, _response, body) => {
    const $ = cheerio.load(body)
    const rs = $('script')
    try {
      let arr = rs[6].children[0].data.split('contextMenuEndpoint').map(e => {
        return e.slice(2, -2)
      })
      arr.pop()
      arr.shift()
      arr = arr.map(e => {
        const itm = e.split('liveChatTextMessageRenderer')
        const message = JSON.parse(itm[1].slice(2) + '}')
        const timestampUsec = itm[0].split('timestampUsec')[1].split(',')[0].slice(3, -1)
        return {
          key: `youtube-${timestampUsec}`,
          value: {
            timestamp: new Date(timestampUsec / 1000),
            author: message.authorName.simpleText,
            source: 'youtube',
            message: message.message.simpleText
          }
        }
      })
      arr.forEach(comment => {
        brain[comment.key] = comment
      })
      setTimeout(() => { getYoutubeChat() }, 5e3)
    } catch (_e) {
      console.log('youtube: cooling down...')
      setTimeout(() => { getYoutubeChat() }, 1e4)
    }
    const size = Object.keys(brain).length
    console.log(`youtube size: ${size}`)
  })
}

exports.start = settings => {
  channel = settings.youtubeVideoId
  getYoutubeChat()
  return brain
}

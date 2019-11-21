const { app, dialog } = require('electron')
const express = require('express')
const Http = require('http')
const cors = require('cors')
const socketIO = require('socket.io')
const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const cloudServer = require('./cloudServer')
const Chat = require('./chat')

const expressApp = express()
const http = Http.Server(expressApp)
const io = socketIO(http)

io.origins('*:*')

expressApp.use(cors())
expressApp.use(express.static(join(__dirname, '../../dist')))
expressApp.use(express.json())

expressApp.get('/buttons.json', (req, res) => {
  let json
  try {
    const path = join(app.getPath('userData'), 'buttons.json')
    json = JSON.parse(readFileSync(path, { encoding: 'utf8' }))
  } catch (_error) {
    json = []
  }
  res.json(json)
})

expressApp.get('/downloadbuttons', (req, res) => {
  dialog.showSaveDialog({
    defaultPath: '~/buttons.json'
  }, location => {
    if (!location) return
    let json
    try {
      const path = join(app.getPath('userData'), 'buttons.json')
      json = JSON.parse(readFileSync(path, { encoding: 'utf8' }))
    } catch (_error) {
      json = []
    }
    writeFileSync(location, JSON.stringify(json, false, 2))
  })
  res.sendStatus(200)
})

expressApp.post('/settings.json', (req, res) => {
  const path = join(app.getPath('userData'), 'settings.json')
  writeFileSync(path, JSON.stringify(req.body, false, 2))
  res.json({ success: true })
})

expressApp.get('/settings.json', (req, res) => {
  let json
  try {
    const path = join(app.getPath('userData'), 'settings.json')
    json = JSON.parse(readFileSync(path, { encoding: 'utf8' }))
  } catch (_error) {
    json = {}
  }
  res.json(json)
})

expressApp.post('/buttons.json', (req, res) => {
  const path = join(app.getPath('userData'), 'buttons.json')
  writeFileSync(path, JSON.stringify(req.body, false, 2))
  res.json({ success: true })
  if (req.query.willReload) global.win.reload()
})

expressApp.get('/search', (req, res) => {
  const { q: search } = req.query
  const myInstants = 'https://www.myinstants.com'
  const url = `${myInstants}/search/?name=${search}`
  request.get(url, (_err, _response, body) => {
    const $ = cheerio.load(body)
    const sounds = []
    $('.instant').each(function (i, elem) {
      const title = $(this)
        .text()
        .replace(/\n/g, '')
      const link = $(this)
        .children('.small-button')
        .attr('onmousedown')
        .replace(/play\('|'\)/g, '')
      const item = { title, link: `${myInstants}${link}` }
      sounds.push(item)
    })
    res.json({ success: true, sounds })
  })
})

expressApp.get('/overlay', (req, res) => {
  res.sendFile(join(__dirname, '../../dist/overlay.html'))
})

expressApp.get('/overlay-chat', (req, res) => {
  res.sendFile(join(__dirname, '../../dist/chat.html'))
})

const chat = new Chat()
const sse = (_req, res) => {
  chat.on('message', message => {
    if (!res) return
    res.write(`id: ${message.key}\n`)
    res.write(`data: ${JSON.stringify(message)}\n\n`)
  })
}

expressApp.get('/chat-stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  res.write('\n')
  sse(req, res)
})

expressApp.get('/logs', (req, res) => {
  res.sendFile(join(__dirname, '../../dist/logs.html'))
})

const sseLogs = (_req, res) => {
  global.logger.on('message', message => {
    if (!res) return
    res.write(`id: ${message.key}\n`)
    res.write(`data: ${JSON.stringify(message)}\n\n`)
  })
}

expressApp.get('/logs-stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  res.write('\n')
  sseLogs(req, res)
})

expressApp.get('/restream', (req, res) => {
  console.log(req.query)
  res.sendStatus(200)
})

expressApp.get('/cloudStatus', (req, res) => {
  res.json({ success: true, status: cloudServer.status(), url: cloudServer.url() })
})

expressApp.get('/startCloud', async (req, res) => {
  await cloudServer.start()
  res.json({ success: true, url: cloudServer.url() })
})

expressApp.get('/stopCloud', (req, res) => {
  cloudServer.stop()
  res.json({ success: true, url: '' })
})

expressApp.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../../dist/index.html'))
})

io.on('connection', socket => {
  socket.on('triggerOvelay', data => {
    const overlaySettings = data.btn.overlaySettings
    if (overlaySettings && overlaySettings.enable) io.emit('toggleOverlay', data.btn.overlaySettings)
  })
  socket.on('userClick', data => {
    io.emit('userClicked', data)
  })
})

exports.http = http

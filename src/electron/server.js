const { app } = require('electron')
const express = require('express')
const Http = require('http')
const cors = require('cors')
const socketIO = require('socket.io')
const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')

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

expressApp.post('/buttons.json', (req, res) => {
  const path = join(app.getPath('userData'), 'buttons.json')
  writeFileSync(path, JSON.stringify(req.body, false, 2))
  res.json({ success: true })
})

expressApp.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../../dist/index.html'))
})

io.on('connection', socket => {
  socket.on('userClick', data => {
    io.emit('userClicked', data)
  })
})

exports.http = http

const { spawn } = require('child_process')
const { app } = require('electron')
const { readFileSync } = require('fs')
const { join } = require('path')

const ngrok = {
  status: 'offline',
  process: null,
  url: null
}

const killProcess = () => {
  if (!ngrok.process) return
  return new Promise(resolve => {
    ngrok.process.on('exit', () => {
      ngrok.status = 'offline'
      ngrok.process = null
      ngrok.url = null
      resolve()
    })
    ngrok.process.kill()
  })
}

const start = () => {
  let pResolve
  const p = new Promise(resolve => { pResolve = resolve })
  let proc = null
  let json
  try {
    const path = join(app.getPath('userData'), 'settings.json')
    json = JSON.parse(readFileSync(path, { encoding: 'utf8' }))
  } catch (_error) {
    json = {}
  }
  try {
    const path = json.ngrok
    proc = spawn(path, ['http', '3000', '--log=stdout'])
  } catch (e) {
    return
  }
  if (!proc) return

  proc.stdout.on('data', data => {
    const msg = data.toString()
    const success = msg.match(/started tunnel.*url=(.*)/)
    if (success) {
      ngrok.status = 'online'
      ngrok.url = success[1]
      pResolve(true)
    }
  })

  proc.stderr.on('data', data => {
    killProcess()
  })

  proc.on('exit', () => {
    ngrok.status = 'offline'
    ngrok.process = null
  })

  process.on('exit', async () => killProcess())

  ngrok.process = proc
  return p
}

module.exports = {
  status: () => ngrok.status,
  url: () => ngrok.url,
  start,
  stop: killProcess
}

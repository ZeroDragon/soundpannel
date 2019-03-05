const { BrowserWindow, app } = require('electron')
const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')
const { http } = require('./server')

const port = 3000
let win

const createWindow = () => {
  let electronSettings = readFileSync(
    join(__dirname, './electron-settings.json')
  )
  try {
    electronSettings = JSON.parse(electronSettings)
  } catch (_error) {
    electronSettings = {}
  }
  win = new BrowserWindow(
    Object.assign(
      electronSettings,
      {
        titleBarStyle: 'hidden',
        webPreferences: {
          nodeIntegration: true
        }
      }
    )
  )
  win.loadURL(`http://localhost:${port}/`)
  win.on('close', () => {
    const bounds = win.getBounds()
    const settingsFile = join(__dirname, 'electron-settings.json')
    writeFileSync(settingsFile, JSON.stringify(bounds, false, 2))
  })
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', () => {
  http.listen(port, () => {
    createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

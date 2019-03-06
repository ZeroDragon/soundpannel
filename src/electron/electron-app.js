const { BrowserWindow, app, Menu } = require('electron')
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

  const template = [{
    label: 'Sound Pannel',
    submenu: [
      { label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit() } }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select all', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]
  }]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('ready', () => {
  http.listen(port, () => {
    createWindow()
  })
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

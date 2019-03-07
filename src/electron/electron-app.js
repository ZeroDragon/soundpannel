const { BrowserWindow, app, Menu } = require('electron')
const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')
const { http } = require('./server')

const port = 3000
let win

const createWindow = () => {
  let electronSettings
  try {
    electronSettings = readFileSync(
      join(app.getPath('userData'), 'electron-settings.json')
    )
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
    const settingsFile = join(app.getPath('userData'), 'electron-settings.json')
    writeFileSync(settingsFile, JSON.stringify(bounds, false, 2))
  })
  win.on('closed', () => {
    win = null
  })

  const template = [
    {
      label: 'Sound Pannel',
      submenu: [
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select all', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function () { app.quit() } }
      ]
    }
  ]
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

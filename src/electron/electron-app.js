const { BrowserWindow, app, autoUpdater, dialog, Menu } = require('electron')
const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')
const { http } = require('./server')

const port = 3000
let win
const server = 'https://hazel-qwdqteu7k.now.sh/'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`
autoUpdater.setFeedURL(feed)
setInterval(() => {
  autoUpdater.checkForUpdates()
}, 6e4)

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})

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

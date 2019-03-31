const { BrowserWindow, app, Menu, dialog } = require('electron')
const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')
const { updater } = require('./updater')
const { http } = require('./server')

const port = 3000

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
  global.win = new BrowserWindow(
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
  global.win.loadURL(`http://localhost:${port}/`)
  global.win.on('close', () => {
    const bounds = global.win.getBounds()
    const settingsFile = join(app.getPath('userData'), 'electron-settings.json')
    writeFileSync(settingsFile, JSON.stringify(bounds, false, 2))
  })
  global.win.on('closed', () => {
    global.win = null
  })

  const editMenu = [
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
    { label: 'Select all', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click (_item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload()
      }
    }
  ]

  if (process.env.ENV === 'development') {
    editMenu.push(
      {
        label: 'Open dev tools',
        accelerator: 'CmdOrCtrl+Alt+i',
        click (_item, focusedWindow) {
          focusedWindow.webContents.openDevTools()
        }
      }
    )
  }

  const menu = [
    {
      label: 'Sound Pannel',
      submenu: [
        { label: `About`, click: function () { about() } },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function () { app.quit() } }
      ]
    },
    {
      label: 'Edit',
      submenu: editMenu
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  checkForUpdates()
}

const about = () => {
  dialog.showMessageBox({
    type: 'info',
    buttons: ['Check for updates', 'Close'],
    defaultId: 0,
    title: `Sound Pannel`,
    message: `Version: ${app.getVersion()}`,
    detail: 'Sound Pannel created with ❤️ by @ZeroDragon'
  }, (response) => {
    if (response === 0) {
      checkForUpdates((_error, hasUpdates) => {
        if (!hasUpdates) {
          dialog.showMessageBox({
            type: 'info',
            buttons: ['Close'],
            title: `Sound Pannel`,
            message: `Success`,
            detail: 'You are playing with the newest version available'
          }, () => { })
        }
      })
    }
  })
}

const checkForUpdates = (cb = () => {}) => {
  updater((_error, hasUpdates) => {
    if (hasUpdates) {
      dialog.showMessageBox({
        type: 'info',
        buttons: ['Close'],
        title: `Sound Pannel`,
        message: `New version available`,
        detail: 'There is a new version to download at https://zerodragon.github.io/soundpannel/'
      }, () => {})
    }
    cb(_error, hasUpdates)
  })
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
  if (global.win === null) {
    createWindow()
  }
})

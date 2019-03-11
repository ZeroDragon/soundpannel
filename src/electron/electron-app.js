const { BrowserWindow, app, Menu, dialog } = require('electron')
const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')
const { updater, checker } = require('./updater')
const { http } = require('./server')

const port = 3000
let win
let updating = false
let updateDownloaded = false

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
        { label: `Check for updates...`, click: function () { checkForUpdates() } },
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
}

const checkForUpdates = () => {
  if (updating) {
    dialog.showMessageBox({
      type: 'info',
      buttons: ['Close'],
      title: `Sound Board`,
      message: `Hang on a sec`,
      detail: 'We are downloading the update...'
    }, (response) => {})
    return
  }
  checker((_error, hasUpdates) => {
    if (hasUpdates) {
      dialog.showMessageBox({
        type: 'info',
        buttons: ['Download update', 'Close'],
        title: `Sound Board. Current version: ${app.getVersion()}`,
        message: `There is a new version available. Do you want to start the download?`,
        detail: 'Download will accur in the background'
      }, (response) => {
        console.log(response)
        if (response === 0) {
          updating = true
          console.log({ updating })
          updater(() => {
            console.log('done')
            updating = false
            updateDownloaded = true
          }, true)
        }
      })
    } else if (updateDownloaded) {
      dialog.showMessageBox({
        type: 'info',
        buttons: ['Close'],
        title: 'Sound Board',
        message: `Download finished`,
        detail: 'The new version will be ready next time you run open this app'
      }, () => { })
    } else {
      dialog.showMessageBox({
        type: 'info',
        buttons: ['Close'],
        title: 'Sound Board',
        message: `Success`,
        detail: 'Your are running the latest version!'
      }, () => { })
    }
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
  if (win === null) {
    createWindow()
  }
})

const { BrowserWindow } = require('electron')

const musicPlayer = port => {
  global.playerWindow = new BrowserWindow(
    {
      frame: false,
      width: 275,
      height: 348,
      resizable: false,
      center: true,
      transparent: true
    }
  )
  global.playerWindow.loadURL(`http://localhost:${port}/webamp`)
  global.playerWindow.on('closed', () => {
    global.playerWindow = null
  })
}

exports.musicPlayer = musicPlayer

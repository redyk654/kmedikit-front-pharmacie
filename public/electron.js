const { app, net, BrowserWindow, Notification, dialog, autoUpdater } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
// const { autoUpdater } = require('electron-updater')

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 670,
    minWidth: 1100,
    minHeight: 520,
    icon: path.join(__dirname, '../build/pharmacie_icon.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(
      isDev ? 'http:localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
    )

    // win.setMenuBarVisibility(false)
    // win.removeMenu()
}

app.whenReady().then( async () => {
  await createWindow()
  // showNotification();

  // autoUpdater.autoDownload = false;

  // autoUpdater.setFeedURL({
  //   provider: 'github',
  //   owner: 'redyk654',
  //   repo: 'https://github.com/redyk654/kmd-pharmacie-hdmbanga',
  //   releaseType: 'release',
  //   url: 'https://github.com/redyk654/kmd-pharmacie-hdmbanga/releases/latest',
    
  // });

  // autoUpdater.checkForUpdates();
  // autoUpdater.on('update-available', () => {
  //   dialog.showMessageBox({
  //     type: 'question',
  //     message: 'Une mise à jour est disponible, télécharger maintenant ou plus tard ?',
  //     buttons: ['Télécharger', 'Plus tard']
  //   }, (response) => {
  //     if (response === 0) {
  //       autoUpdater.downloadUpdate()
  //     }
  //   })
  // })

  // autoUpdater.on('update-downloaded', () => {
  //   // La mise à jour a été téléchargée et va être installée
  //   autoUpdater.quitAndInstall();
  // });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

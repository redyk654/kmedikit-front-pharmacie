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


const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BODY = 'Notification from the Main process'

function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

app.whenReady().then( async () => {
  await createWindow()
  // showNotification();

  autoUpdater.autoDownload = false;

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'redyk654',
    repo: 'https://github.com/redyk654/pharmacie-cmab/tree/bepanda',
    releaseType: 'release',
    url: 'https://github.com/redyk654/pharmacie-cmab/releases/latest',
    
  });

  autoUpdater.checkForUpdates();
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'question',
      message: 'Une mise à jour est disponible, télécharger maintenant ou plus tard ?',
      buttons: ['Télécharger', 'Plus tard']
    }, (response) => {
      if (response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
  })

  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      type: 'info',
      message: 'Une mise à jour est disponible, télécharger maintenant ou plus tard ?',
      buttons: ['OK']
    })
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})


// app.whenReady().then(createWindow).then(showNotification)

// autoUpdater.on('update-available', info => {
//   // Une nouvelle version est disponible
//   autoUpdater.checkForUpdates();
//   showNotification();
// });

// autoUpdater.on('update-not-available', () => {
//   // Il n'y a pas de nouvelle version
//   showNotification();

// });

// autoUpdater.on('download-progress', progressObj => {
//   // Afficher la progression du téléchargement
//   // showNotification();
// });

// autoUpdater.on('update-downloaded', () => {
//   // La mise à jour a été téléchargée et va être installée
//   autoUpdater.quitAndInstall();
//   // showNotification();
// });

// function verifUpdates () {
//   console.log("ok");
//   autoUpdater.autoDownload = false;
//   autoUpdater.setFeedURL({
//   provider: 'github',
//   owner: 'redyk654',
//   repo: 'https://github.com/redyk654/pharmacie-cmab',
//   // La valeur de la propriété `private` doit être `true` si votre référentiel Github est privé.
//   private: false
//   });

//   const feedUrlReader = net.request(autoUpdater.getFeedURL(), {
//   method: 'GET'
//   });

//   feedUrlReader.on('response', response => {
//   let errorMessage;
//   if (response.statusCode === 200) {
//     response.on('error', error => {
//       errorMessage = error;
//     });

//     response.on('data', data => {
//       const json = JSON.parse(data);
//       autoUpdater.setFeedURL(json.url);
//       autoUpdater.checkForUpdates();
//     });
//   } else {
//     errorMessage = ('Cannot find releases on Github.');
//   }
//   if (errorMessage) {
//     console.error(errorMessage);
//   }
//   });

//   feedUrlReader.on('error', error => {
//     console.error('Unable to connect to Github.');
//   });

//   autoUpdater.on('update-available', info => {
//     // Une nouvelle version est disponible
//     autoUpdater.checkForUpdates();
//     console.log('available');
//   });
  
//   autoUpdater.on('update-not-available', () => {
//     // Il n'y a pas de nouvelle version
//     console.log('not-available');
//   });
  
//   autoUpdater.on('download-progress', progressObj => {
//     // Afficher la progression du téléchargement
//     console.log('download-in-progress');
//   });
  
//   autoUpdater.on('update-downloaded', () => {
//     // La mise à jour a été téléchargée et va être installée
//     console.log("update-downloaded");
//     autoUpdater.quitAndInstall();
//   });
// }
const { app, BrowserWindow, session /*, powerSaveBlocker*/ } = require('electron')
const path = require('path')

// app.commandLine.appendSwitch('disable-gpu')
// app.commandLine.appendSwitch('disable-gpu-compositing')
// app.commandLine.appendSwitch('disable-accelerated-video-decode')
// app.commandLine.appendSwitch('disable-accelerated-video-encode')
// powerSaveBlocker.start('prevent-app-suspension')

const createWindow = () => {

  session.defaultSession.webRequest.onBeforeRequest({
    urls: ['https://embed.twitch.tv/*channel=*']
  }, (details, cb) => {
    var redirectURL = details.url

    var params = new URLSearchParams(redirectURL.replace('https://embed.twitch.tv/', ''))
    if (params.get('parent') != '') {
      cb({})
      return
    }
    params.set('parent', 'locahost')
    params.set('referrer', 'https://localhost/')

    var redirectURL = 'https://embed.twitch.tv/?' + params.toString()
    console.log('Adjust to', redirectURL)

    cb({
      cancel: false,
      redirectURL
    })
  })

  session.defaultSession.webRequest.onHeadersReceived({
    urls: [
      'https://www.twitch.tv/*',
      'https://player.twitch.tv/*',
      'https://embed.twitch.tv/*'
    ]
  }, (details, cb) => {
    var responseHeaders = details.responseHeaders

    console.log('headers', details.url, responseHeaders)

    delete responseHeaders['Content-Security-Policy']

    cb({
      cancel: false,
      responseHeaders
    })
  })

  const win = new BrowserWindow({
    title: 'StreamViewer',
    backgroundThrottling: false,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: false,
    transparent: false,
    width: 1342,
    height: 754,
    webPreferences: {
      nodeIntegration: true,
      disablewebsecurity: true,
      preload: path.join(__dirname, 'preload.js'),
      //partition: 'persist:rimionship'
    }
  })

  win.webContents.on('before-input-event', (event, input) => {
    if (input.control) {
      const key = input.key.toLowerCase()
      if (key === '1') win.loadURL('https://registration.rimionship.com')
      if (key === '2') win.loadURL('https://frontend.rimionship.com')
      if (key === 't') win.loadURL('https://twitch.tv')
      if (key === 'r') win.loadFile('index.html')
      if (key === 'c') win.loadFile('empty.html')
      if (key === 'd') win.webContents.openDevTools()
      event.preventDefault()
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
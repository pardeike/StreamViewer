const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('envVars', {
  streamViewerHost: process.env['STREAM-VIEWER-HOST']
})

window.addEventListener('DOMContentLoaded', () => {
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector)
  //   if (element) element.innerText = text
  // }

  // for (const dependency of ['chrome', 'node', 'electron']) {
  //   replaceText(`${dependency}-version`, process.versions[dependency])
  // }
})
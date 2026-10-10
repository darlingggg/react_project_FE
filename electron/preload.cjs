const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("desktop", {
  notice: (message) => ipcRenderer.send("notice", message),
  minimizeWindow: () => ipcRenderer.send("window:minimize"),
  toggleDevTools: () => ipcRenderer.send("window:toggle-devtools")
})

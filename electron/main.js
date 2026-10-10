import { app, BrowserWindow,ipcMain,Notification,Menu,shell } from 'electron';
import path from 'path'

ipcMain.on("notice", (event, message) => {
  showNotification(message)
});

const isMac = process.platform === 'darwin'
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [{
        label: app.name,
        submenu: [
          { role: 'about',label:"关于" },
          { type: 'separator' },
          { role: 'services',label:"服务" },
          { type: 'separator' },
          { role: 'hide',label:"隐藏" },
          { role: 'hideOthers',label:"隐藏其他" },
          { role: 'unhide',label:"显示全部" },
          { type: 'separator' },
          { role: 'quit',label:"退出" }
        ]
      }]
    : []),
  // { role: 'fileMenu' }
  {
    label: '文件',
    submenu: [
      isMac ? { role: 'close',label:"关闭" } : { role: 'quit',label:"退出" }
    ]
  },
  // { role: 'editMenu' }
  {
    label: '编辑',
    submenu: [
      { role: 'undo',label:"撤销" },
      { role: 'redo',label:"重做" },
      { type: 'separator' },
      { role: 'cut',label:"剪切" },
      { role: 'copy',label:"复制" },
      { role: 'paste',label:"粘贴" },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle',label:"粘贴并匹配样式" },
            { role: 'delete',label:"删除" },
            { role: 'selectAll',label:"全选" },
            { type: 'separator' },
            {
              label: '阅读',
              submenu: [
                { role: 'startSpeaking',label:"开始朗读" },
                { role: 'stopSpeaking',label:"停止朗读" }
              ]
            }
          ]
        : [
            { role: 'delete',label:"删除" },
            { type: 'separator' },
            { role: 'selectAll',label:"全选" }
          ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: '视图',
    submenu: [
      { role: 'reload',label:"刷新" },
      { role: 'forceReload',label:"强制刷新" },
      { role: 'toggleDevTools',label:"切换开发者工具" },
      { type: 'separator' },
      { role: 'resetZoom',label:"重置缩放" },
      { role: 'zoomIn',label:"放大" },
      { role: 'zoomOut',label:"缩小" },
      { type: 'separator' },
      { role: 'togglefullscreen',label:"切换全屏" }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize',label:"最小化" },
      { role: 'zoom',label:"缩放" },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front',label:"置于顶层" },
            { type: 'separator' },
            { role: 'window',label:"窗口" }
          ]
        : [
            { role: 'close',label:"关闭" }
          ])
    ]
  },
  {
    role: '帮助',
    submenu: [
      {
        label: '了解更多',
        click: async () => {
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

const getAppWindow = event => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (event.senderFrame !== window?.webContents.mainFrame) return null
  if (event.senderFrame.origin !== 'http://localhost:5173') return null
  return window
}

ipcMain.on('window:minimize', event => {
  getAppWindow(event)?.minimize()
})

ipcMain.on('window:toggle-devtools', event => {
  getAppWindow(event)?.webContents.toggleDevTools()
})

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    backgroundMaterial: 'acrylic',
    // frame: false,
    transparent: true,
    titleBarOverlay: {
      color: '#28149b00',
      symbolColor: '#ffffff',
      height: 40,
    },
    webPreferences: {
      preload: path.resolve(import.meta.dirname, "./preload.cjs"), // 预加载脚本 引入预加载脚本并于渲染进程建立连接，使渲染进程可以与主进程通信
    },
  });
  mainWindow.loadURL('http://localhost:5173');
  return mainWindow;
};

app.on("ready", () => {
  createMainWindow() // 创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})


// 完善窗口行为 确保符合不同系统的使用习惯
app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    app.quit() // 退出应用程序
})

function showNotification (message) {
  const notification = new Notification({
    title: '新答卷',
    body: message,
    actions: [{ type: 'button', text: '查看' },{type:"button", text: "忽略"}],
    hasReply:true,
    replyPlaceholder: '输入回复内容',
  })

  notification.on('action', (event) => {
    if (event.actionIndex === 0) {
      const window = BrowserWindow.getAllWindows()[0]
      window?.show()
      window?.focus()
    }
  })
  console.log("创建通知")

  notification.on('reply', (event) => {
    console.log('用户回复：', event.reply)
    // 在这里处理回复，例如调用后端接口
  })

  notification.show()
}

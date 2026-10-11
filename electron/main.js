import { app, BrowserWindow, ipcMain, Notification, Menu, shell, nativeImage, Tray, dialog } from 'electron'
import path from 'path'
import { writeFile } from 'node:fs/promises'

// 单实例锁
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const window = BrowserWindow.getAllWindows()[0] ?? createMainWindow()
    if (window.isMinimized()) window.restore()
    window.show()
    window.focus()
  })
}

ipcMain.on('notice', (event, message) => {
  showNotification(message)
})

ipcMain.handle('export-csv', exportCSV)

// const isMac = process.platform === 'darwin'
// const template = [
//   // { role: 'appMenu' }
//   ...(isMac
//     ? [{
//         label: app.name,
//         submenu: [
//           { role: 'about',label:"关于" },
//           { type: 'separator' },
//           { role: 'services',label:"服务" },
//           { type: 'separator' },
//           { role: 'hide',label:"隐藏" },
//           { role: 'hideOthers',label:"隐藏其他" },
//           { role: 'unhide',label:"显示全部" },
//           { type: 'separator' },
//           { role: 'quit',label:"退出" }
//         ]
//       }]
//     : []),
//   // { role: 'fileMenu' }
//   {
//     label: '文件',
//     submenu: [
//       isMac ? { role: 'close',label:"关闭" } : { role: 'quit',label:"退出" }
//     ]
//   },
//   // { role: 'editMenu' }
//   {
//     label: '编辑',
//     submenu: [
//       { role: 'undo',label:"撤销" },
//       { role: 'redo',label:"重做" },
//       { type: 'separator' },
//       { role: 'cut',label:"剪切" },
//       { role: 'copy',label:"复制" },
//       { role: 'paste',label:"粘贴" },
//       ...(isMac
//         ? [
//             { role: 'pasteAndMatchStyle',label:"粘贴并匹配样式" },
//             { role: 'delete',label:"删除" },
//             { role: 'selectAll',label:"全选" },
//             { type: 'separator' },
//             {
//               label: '阅读',
//               submenu: [
//                 { role: 'startSpeaking',label:"开始朗读" },
//                 { role: 'stopSpeaking',label:"停止朗读" }
//               ]
//             }
//           ]
//         : [
//             { role: 'delete',label:"删除" },
//             { type: 'separator' },
//             { role: 'selectAll',label:"全选" }
//           ])
//     ]
//   },
//   // { role: 'viewMenu' }
//   {
//     label: '视图',
//     submenu: [
//       { role: 'reload',label:"刷新" },
//       { role: 'forceReload',label:"强制刷新" },
//       { role: 'toggleDevTools',label:"切换开发者工具" },
//       { type: 'separator' },
//       { role: 'resetZoom',label:"重置缩放" },
//       { role: 'zoomIn',label:"放大" },
//       { role: 'zoomOut',label:"缩小" },
//       { type: 'separator' },
//       { role: 'togglefullscreen',label:"切换全屏" }
//     ]
//   },
//   // { role: 'windowMenu' }
//   {
//     label: 'Window',
//     submenu: [
//       { role: 'minimize',label:"最小化" },
//       { role: 'zoom',label:"缩放" },
//       ...(isMac
//         ? [
//             { type: 'separator' },
//             { role: 'front',label:"置于顶层" },
//             { type: 'separator' },
//             { role: 'window',label:"窗口" }
//           ]
//         : [
//             { role: 'close',label:"关闭" }
//           ])
//     ]
//   },
//   {
//     role: '帮助',
//     submenu: [
//       {
//         label: '了解更多',
//         click: async () => {
//           await shell.openExternal('https://electronjs.org')
//         }
//       }
//     ]
//   }
// ]

// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)

const getAppWindow = event => {
  // event.sender 是发消息的页面对应的 webContents；这一行找到它所属的 BrowserWindow。找不到时返回 null。
  const window = BrowserWindow.fromWebContents(event.sender)
  // 确认消息来自该窗口的主页面，而不是页面内的 iframe
  if (event.senderFrame !== window?.webContents.mainFrame) return null
  // 确认主页面来自你的 Vite 开发地址。
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
      preload: path.resolve(import.meta.dirname, './preload.cjs'), // 预加载脚本 引入预加载脚本并于渲染进程建立连接，使渲染进程可以与主进程通信
    },
  })
  mainWindow.on('close', event => {
    event.preventDefault() // 阻止默认的关闭行为
    mainWindow.hide() // 隐藏窗口而不是关闭
  })
  mainWindow.loadURL('http://localhost:5173')
  return mainWindow
}

// 为 Tray 对象保存一个全局引用以避免被垃圾回收
let tray

// 16x16 红色圆形 data URL
const icon = nativeImage.createFromDataURL(
  'data:image/png;base64,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'
)

app.on('ready', () => {
  createMainWindow() // 创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        const window = BrowserWindow.getAllWindows()[0]
        if (window) {
          window.show()
          window.focus()
        }
      },
    },
    { type: 'separator' },
    { label: '退出', role: 'quit' },
  ])
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    const window = BrowserWindow.getAllWindows()[0]
    if (window) {
      window.show()
      window.focus()
    }
  })
})

// 完善窗口行为 确保符合不同系统的使用习惯
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') app.quit() // 退出应用程序
})

// 展示通知
function showNotification(message) {
  const notification = new Notification({
    title: '新答卷',
    body: message,
    actions: [
      { type: 'button', text: '查看' },
      { type: 'button', text: '忽略' },
    ],
    hasReply: true,
    replyPlaceholder: '输入回复内容',
  })

  notification.on('action', event => {
    if (event.actionIndex === 0) {
      const window = BrowserWindow.getAllWindows()[0]
      if (window) {
        window.show()
        window.focus()
      } else {
        createMainWindow()
      }
    }
  })
  console.log('创建通知')

  notification.on('reply', event => {
    console.log('用户回复：', event.reply)
    // 在这里处理回复，例如调用后端接口
  })

  notification.show()
}

// 导出 CSV 文件
async function exportCSV(event, data) {
  const window = getAppWindow(event)
  if (!window) throw new Error('无效的调用来源')

  const cell = value => `"${String(value ?? '').replaceAll('"', '""')}"`

  const csv = '\uFEFF' + data.map(row => row.map(cell).join(',')).join('\r\n')

  const date = new Date().toLocaleDateString('sv-SE')

  const { canceled, filePath } = await dialog.showSaveDialog(window, {
    defaultPath: `问卷答卷-${date}.csv`,
    filters: [{ name: 'CSV 文件', extensions: ['csv'] }],
  })

  if (canceled || !filePath) return false
  await writeFile(filePath, csv, 'utf8')
  return true
}

const { BrowserWindow } = require('electron').remote;
const { PureServer } = require("./node/PureServer");

// 默认启动
let serverObj = new PureServer();

// 设置监听端口
serverObj.listen = 9876;

// 目前只打开xdtool工具
// 设置静态目录
serverObj.setStatic("/xdtool/", process.cwd() + "/apps/xdtool/app/");

// 打开相应app页面
let win = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: true,
    webPreferences: {
        nodeIntegration: false
    }
});

win.loadURL(`http://localhost:${9876}/xdtool/index.html`);

// 打开开发者工具
win.webContents.openDevTools()
const { BrowserWindow } = require('electron').remote;
const { PureServer } = require("./node/PureServer");
const getRandomId = () => Math.random().toString(32).substr(2);

// 默认启动
let serverObj = new PureServer();

// 设置监听端口
serverObj.listen = 9876;

let xdtoolKey = `xdtool_${getRandomId()}`;

// 目前只打开xdtool工具
// 设置静态目录
serverObj.setStatic(`/${xdtoolKey}/`, process.cwd() + "/apps/xdtool/app/");

// 打开相应app页面
let win = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    titleBarStyle: "hiddenInset",
    webPreferences: {
        nodeIntegration: true
    }
});

win.loadURL(`http://localhost:${9876}/${xdtoolKey}/index.html`);

// 打开开发者工具
win.webContents.openDevTools()
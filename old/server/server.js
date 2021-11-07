const { BrowserWindow, app } = require('electron').remote;
const { PureServer } = require("./node/PureServer");
const getRandomId = () => Math.random().toString(32).substr(2);
const dev = require("../dev");

// 默认启动
let pureServer = new PureServer();

// 设置监听端口
pureServer.port = 9876;

// 设置静态目录
// let softAfterName = `${opts.name}_${getRandomId()}`;
let softAfterName = "xdtool";
pureServer.setStatic(`/${softAfterName}/`, process.cwd() + `/apps/xdtool_app/`);

let softwareUrl = `http://localhost:${pureServer.port}/${softAfterName}/index.html`;

// 打开页面
let win = new BrowserWindow({
    width: 1000,
    height: 660,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    titleBarStyle: "hiddenInset",
    webPreferences: {
        nodeIntegration: true
    }
});

win.loadURL(`${softwareUrl}`);

dev.debug && win.webContents.openDevTools();

win.on("closed", () => app.quit());
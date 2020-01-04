const { BrowserWindow } = require('electron').remote;
const { PureServer } = require("./node/PureServer");
const getRandomId = () => Math.random().toString(32).substr(2);

// 默认启动
let runningServer = new PureServer();

// 设置监听端口
runningServer.port = 9876;

// 打开软件
function openSoftware(opts) {
    let softAfterName = `${opts.name}_${getRandomId()}`;

    // 引用相应的server main.js
    let serverControl = require(`../apps/${opts.name}/server/main`);

    // 运行注册函数
    serverControl.register({
        runningServer
    });

    // 目前只打开xdtool工具
    // 设置静态目录
    runningServer.setStatic(`/${softAfterName}/`, process.cwd() + `/apps/${opts.name}/app/`);

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

    win.loadURL(`http://localhost:${runningServer.port}/${softAfterName}/index.html`);

    // 打开开发者工具
    win.webContents.openDevTools()

    // 关闭后注销函数
    win.on("close", e => {
        // 注销函数
        serverControl.unregister({
            runningServer
        });
    });
}

openSoftware({
    type: "apps",
    name: "xdtool"
});
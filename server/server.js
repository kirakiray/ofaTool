const { BrowserWindow, app } = require('electron').remote;
const { PureServer } = require("./node/PureServer");
const { StanzServerAgent } = require("./node/StanzAgent");
const getRandomId = () => Math.random().toString(32).substr(2);

// 默认启动
let pureServer = new PureServer();
let stanzAgent = new StanzServerAgent();

// 设置监听端口
pureServer.port = 9876;

// stanz服务代理对象
stanzAgent.port = 9866;

const dev = require("../dev");

// 打开软件
function openSoftware(opts) {
    // let softAfterName = `${opts.name}_${getRandomId()}`;
    let softAfterName = `${opts.name}`;

    // 生成stanz对象
    let sAgent = stanzAgent.create({
        name: opts.name
    }, "100");

    console.log(stanzAgent);

    // 引用相应的server main.js
    let serverControl = require(`../apps/${opts.name}/server/main`);

    // 运行注册函数
    serverControl.register({
        pureServer, sAgent, stanzAgent
    });

    // 目前只打开xdtool工具
    // 设置静态目录
    pureServer.setStatic(`/${softAfterName}/`, process.cwd() + `/apps/${opts.name}/app/`);

    let softwareUrl = `http://localhost:${pureServer.port}/${softAfterName}/index.html`;

    console.log(`${softwareUrl}?pageid=${getRandomId()}`);

    // 获取所有窗口，是不是已经关闭了
    let allWins = BrowserWindow.getAllWindows();
    let hasThisWin;

    allWins.forEach(e => {
        let url = e.getURL();

        if ((url.indexOf(softwareUrl) > -1)) {
            hasThisWin = true;
        }
    });

    if (!hasThisWin) {
        // 打开相应app页面
        let win = new BrowserWindow({
            width: 720,
            height: 480,
            minWidth: 600,
            minHeight: 400,
            frame: false,
            titleBarStyle: "hiddenInset",
            webPreferences: {
                nodeIntegration: true
            }
        });

        win.loadURL(`${softwareUrl}?pageid=${getRandomId()}`);

        // 打开开发者工具
        dev.debug && win.webContents.openDevTools();

        win.on("closed", judgeClose);
    }
}

function judgeClose() {
    let wins = BrowserWindow.getAllWindows();
    if (wins.length === 1) {
        app.quit();
    }
}

openSoftware({
    type: "apps",
    name: "xdtool"
});
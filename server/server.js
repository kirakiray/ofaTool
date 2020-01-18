const { BrowserWindow } = require('electron').remote;
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

// 打开软件
function openSoftware(opts) {
    // let softAfterName = `${opts.name}_${getRandomId()}`;
    let softAfterName = `${opts.name}`;

    // 生成stanz对象
    let sAgent = stanzAgent.create({
        name: opts.name
    }, "100");

    // 引用相应的server main.js
    let serverControl = require(`../apps/${opts.name}/server/main`);

    // 运行注册函数
    serverControl.register({
        pureServer, sAgent
    });

    // 目前只打开xdtool工具
    // 设置静态目录
    pureServer.setStatic(`/${softAfterName}/`, process.cwd() + `/apps/${opts.name}/app/`);

    console.log("dizhi => ", `http://localhost:${pureServer.port}/${softAfterName}/index.html`);

    // 打开相应app页面
    let win = new BrowserWindow({
        width: 720,
        height: 480,
        frame: false,
        titleBarStyle: "hiddenInset",
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(`http://localhost:${pureServer.port}/${softAfterName}/index.html`);

    // 打开开发者工具
    win.webContents.openDevTools()

    // 关闭后注销函数
    win.on("close", e => {
        // 注销函数
        serverControl.unregister({
            pureServer, sAgent
        });
    });

}

openSoftware({
    type: "apps",
    name: "xdtool"
});
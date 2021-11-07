const { app, BrowserWindow } = require('electron')

function createWindow() {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width: 320,
        height: 240,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    const dev = require("./dev");

    // 加载server.html文件
    win.loadFile('server/server.html')

    // 打开开发者工具
    // if (dev.debug) {
    //     win.webContents.openDevTools()
    // } else {
    //     win.hide();
    // }

    win.hide();

    win.on("closed", () => {
        win = null;
        // setTimeout(() => app.quit(), 100);
    });
}

app.on('ready', createWindow)
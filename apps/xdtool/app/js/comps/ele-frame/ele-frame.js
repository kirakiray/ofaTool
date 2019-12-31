Component(async () => {
    // 获取当前窗口
    const {
        remote
    } = require('electron');

    const win = remote.getCurrentWindow();

    return {
        tag: "ele-frame",
        temp: true,
        proto: {
            dblTitle() {
                if (win.isMaximized()) {
                    win.unmaximize();
                } else {
                    win.maximize();
                }
            }
        }
    };
});
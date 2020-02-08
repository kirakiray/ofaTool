Component(async () => {
    let win;
    try {
        // 获取当前窗口
        const {
            remote
        } = require('electron');

        win = remote.getCurrentWindow();
    } catch (e) {

    }

    return {
        tag: "ele-frame",
        temp: true,
        data: {
            hideBack: true
        },
        proto: {
            dblTitle() {
                if (!win) {
                    return;
                }
                if (win.isMaximized()) {
                    win.unmaximize();
                } else {
                    win.maximize();
                }
            },
            appBack() {
                this.que("xd-app").back();
            }
        }
    };
});
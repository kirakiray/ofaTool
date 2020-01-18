(() => {
    let shell;
    try {
        shell = require('electron').shell;
    } catch (e) {
        console.warn("require shell error => ", e);
    }

    Component({
        tag: "pannel-info",
        temp: true,
        link: true,
        data: {
            // 当前项目地址
            projectUrl: "",
            // 目录在本地的地址
            projectDir: ""
        },
        proto: {
            // 打开目录
            openDir() {
                shell && shell.showItemInFolder(this.projectDir);
            }
        }
    })
})();
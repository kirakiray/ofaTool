(() => {
    let shell;
    try {
        shell = require('electron').shell;
    } catch (e) {
        console.warn("require shell error => ", e);
    }

    Component(async (load) => {
        let stData = await load("data/stData");

        return {
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
            },
            ready() {
                stData.projectData.watch("dir", (e, val) => {
                    this.projectDir = val;
                });
            }
        }
    })
})();
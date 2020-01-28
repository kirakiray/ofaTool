Component(async (load) => {
    await load("./comps/file-block -pack");

    let rightmenu = await load("command/rightmenu -pack");

    let stData = await load("data/stData");

    let shell;
    try {
        shell = require('electron').shell;
    } catch (e) {
        console.warn("require shell error => ", e);
    }

    return {
        tag: "pannel-file",
        temp: true,
        link: true,
        ready() {
            let oldDirs;

            // 监听选中的项目
            stData.projects.watch("[active=1]", (e, vals) => {
                let target = vals[0];

                if (oldDirs) {
                    // 清空再绑定
                    oldDirs.unsync(this.$fileCon);
                }

                this.$fileCon.empty();

                if (target) {
                    let dirs = stData.dirs[target.dirId];

                    // 覆盖绑定数据
                    dirs.sync(this.$fileCon, null, true);

                    oldDirs = dirs;
                }
            });

            // 监听右键菜单
            this.$fileCon.on("contextmenu", `file-block`, e => {
                let { delegateTarget } = e;
                rightmenu([{
                    label: `在Finder显示 ${delegateTarget.name}`,
                    click() {
                        let dir = stData.projectData.dir + '/' + delegateTarget.getPath();

                        shell && shell.showItemInFolder(dir);
                    }
                }, {
                    label: `浏览器中打开`,
                    click() {
                        let url = stData.projects.seek("[active=1]")[0].webRootUrl + delegateTarget.getPath();

                        shell.openExternal(url);

                    }
                }], e.originalEvent);
            });
        }
    };
});
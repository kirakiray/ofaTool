Component(async (load) => {
    await load("./comps/file-block -pack");

    let [rightmenu, getRightMenu] = await load("command/rightmenu -pack", "util/getRightMenu");

    let stData = await load("data/stData");

    // 更新文件目录树状态
    const refreshList = (block, hideExprs) => {
        let isHide = false;
        hideExprs.some(expr => {
            if (expr.test(block.name)) {
                block.hideblock = true;
                isHide = true;
            } else {
                block.hideblock = false;
            }
            return isHide;
        });

        if (!isHide) {
            block.forEach(e => refreshList(e, hideExprs));
        }
    }

    return {
        tag: "pannel-file",
        temp: true,
        css: true,
        data: {
            dirName: "文件"
        },
        proto: {
            // 修正目录树的状态
            refreshList() {
                this.$fileCon.forEach(e => refreshList(e, stData._hideExprs));
            }
        },
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
                    // 更换dirName
                    this.dirName = target.path.match(/.+\/(.+)/)[1];

                    let dirs = stData.dirs[target.dirId];

                    // 覆盖绑定数据
                    dirs.sync(this.$fileCon, null, true);

                    oldDirs = dirs;

                    // 更新目录树状态
                    this.refreshList();
                }
            });

            // 监听右键菜单
            this.$fileCon.on("contextmenu", `file-block`, e => {
                let { delegateTarget } = e;

                let rightMenuData = getRightMenu({
                    fileBlock: delegateTarget
                });

                rightmenu(rightMenuData, e.originalEvent);
            });
        }
    };
});
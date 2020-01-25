Component(async (load) => {
    await load("./comps/file-block -pack");

    let stData = await load("data/stData");

    return {
        tag: "pannel-file",
        temp: true,
        link: true,
        ready() {
            let oldDirs;
            // 监听选中的项目
            stData.projects.watch("[active=1]", (e, vals) => {
                let target = vals[0];

                let dirs = target.dirs;

                if (oldDirs) {
                    // 清空再绑定
                    oldDirs.unsync(this.$fileCon);
                }

                this.$fileCon.empty();
                // 覆盖绑定数据
                dirs.sync(this.$fileCon, null, true);

                oldDirs = dirs;
            });
        }
    };
});
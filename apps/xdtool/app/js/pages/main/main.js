define(async (load) => {
    // 加载主体框架
    await load('pannels/pannel-info -pack', 'pannels/pannel-file -pack', "pannels/pannel-p-overview -pack", "comps/slide-frame -pack");

    // 项目数据
    let stData = await load("data/stData");

    return {
        temp: true,
        data: {
            // 是否隐藏左边工具栏
            hideFrameLeft: true,
            // 激活中的pannel
            activePannel: "projects"
        },
        watch: {},
        ready() {
            stData.projectData.watch("dir", (e, val) => {
                setTimeout(() => {
                    this.hideFrameLeft = !val;
                }, 100);
            });
        }
    };
});
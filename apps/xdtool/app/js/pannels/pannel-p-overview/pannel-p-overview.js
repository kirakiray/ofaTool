Component(async (load) => {
    let stData = await load("data/stData");

    load("comps/loading-ele -pack");

    return {
        tag: "pannel-p-overview",
        temp: true,
        data: {
            // 项目目录
            projectDir: "",
            // 是否打开loading
            hideLoading: true
        },
        ready() {
            // 点击激活状态修正
            this.on("click", 'pj-block', e => {
                let activeTarget = this.que(`pj-block[active="1"]`);

                let { delegateTarget } = e;

                if (activeTarget === delegateTarget) {
                    return;
                }

                this.hideLoading = false;

                // 延迟设置激活状态，因为有点卡
                setTimeout(() => {
                    // 去掉旧的激活状态
                    activeTarget && (activeTarget.active = 0);

                    // 添加新的激活状态
                    delegateTarget.active = 1;

                    // 延迟关闭loading
                    setTimeout(() => {
                        this.hideLoading = true;
                    }, 100);
                }, 100);
            });

            // 初始数据设置
            stData.projects.forEach(e => {
                this.push({
                    tag: "pj-block",
                    path: e.path,
                    urlKey: e.urlKey,
                    modifyTime: e.modifyTime,
                    webRootUrl: e.webRootUrl
                });
            });

            // 同步自身
            stData.projects.watch(e => {
                e.trends.forEach(trend => {
                    // 不允许projects层的dirs数据传入
                    if (trend.keys[1] === "dirs") {
                        return;
                    }
                    this.entrend(trend);
                });
            });

            // 反向同步到stData
            this.watch(e => {
                e.trends.forEach(trend => stData.projects.entrend(trend));
            });

            // stData.projects.sync(this, null, true);
        },
        use: ["./comps/pj-block -pack"]
    };
});
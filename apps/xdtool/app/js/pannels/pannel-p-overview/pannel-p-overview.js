(() => {
    let dialog;

    try {
        dialog = require('electron').remote.dialog;
    } catch (e) {
        console.warn("dialog unsucceed");
    }

    Component(async (load) => {
        let stData = await load("data/stData");
        const util = await load("util/common");

        load("comps/loading-ele -pack");

        return {
            tag: "pannel-p-overview",
            temp: true,
            link: true,
            data: {
                // 是否隐藏loading
                hideLoading: true,
                sortValueText: "",
                sortValue: "opentime",
                _unpush: ["sortValueText", "sortValue", "hideLoading"]
            },
            watch: {
                sortValue(e, val) {
                    let text = "";

                    // let nowTime = new Date().getTime();

                    switch (val) {
                        case "addtime":
                            text = "项目添加时间";

                            // 修正order排序
                            this.forEach(e => {
                                e.showTime = "addtime";
                                e.refreshOrder();
                                // e.style.order = Math.floor((nowTime - e.addTime) / 1000);
                            });
                            break;
                        case "opentime":
                            text = "最近打开";

                            // 修正order排序
                            this.forEach(e => {
                                e.showTime = "modifytime";
                                e.refreshOrder();
                                // e.style.order = Math.floor((nowTime - e.modifyTime) / 1000);
                            });
                            break;
                    }
                    this.sortValueText = text;
                }
            },
            proto: {
                clickAddBtn() {
                    // 弹窗并选择文件夹
                    dialog && dialog.showOpenDialog({
                        properties: ['openDirectory']
                    }).then(d => {
                        let { filePaths, canceled } = d;
                        if (!canceled) {
                            let path = filePaths[0];
                            this.addProject(path);
                        }
                    })
                },
                addProject(path) {
                    let time = new Date().getTime();

                    // 确保不存在的项目
                    let hasTarget = stData.projects.find(e => e.path === path);

                    if (!hasTarget) {
                        // 添加到projects内
                        stData.projects.push({
                            tag: "pj-block",
                            path,
                            addTime: time,
                            modifyTime: time,
                            dirId: "d" + Math.random().toString(32).slice(2)
                        });
                    }
                }
            },
            ready() {
                // 一分钟刷新一次项目的描述
                setInterval(() => {
                    this.forEach(e => {
                        e.refreshTimeText();
                    });
                }, 60000);

                // 点击激活状态修正
                this.on("click", 'pj-block', async e => {
                    if (!this.hideLoading) {
                        return;
                    }

                    let activeTarget = this.que(`pj-block[active="1"]`);

                    let { delegateTarget } = e;

                    if (activeTarget === delegateTarget) {
                        return;
                    }

                    this.hideLoading = false;

                    // 请求是否初始化
                    let d = await util.post("/refresh_xdtool_dir", {
                        type: "openProject",
                        data: {
                            path: delegateTarget.path
                        }
                    });

                    // 打开项目的情况
                    console.log("打开项目的情况 => ", d);

                    // 延迟设置激活状态，因为有点卡
                    setTimeout(() => {
                        // 去掉旧的激活状态
                        activeTarget && (activeTarget.active = 0);

                        // 添加新的激活状态
                        delegateTarget.active = 1;

                        // 更新时间数据
                        delegateTarget.modifyTime = new Date().getTime();

                        // 延迟关闭loading
                        setTimeout(() => {
                            this.hideLoading = true;
                        }, 100);
                    }, 100);
                });

                stData.projects.sync(this, null, true);
            },
            use: ["./comps/pj-block -pack"]
        };
    });
})();
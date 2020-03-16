Component(async (load) => {
    const stData = await load("data/stData");

    await load("comps/ele-link");

    return {
        tag: "pannel-config",
        temp: true,
        css: true,
        data: {
            // 不显示隐藏文件
            showHiddenFile: false,
            // 显示remoter面板
            showRemoterPannel: false
        },
        proto: {
            get slideFrame() {
                return this.parents("slide-frame")[0];
            }
        },
        watch: {
            showHiddenFile(e, showHidden) {
                let tarId = stData._hideExprs.findIndex(expr => {
                    return expr.toString() === /^\./.toString();
                });

                let needRefresh = false;

                if (!showHidden && tarId === -1) {
                    // 没有就添加
                    stData._hideExprs.push(/^\./);
                    needRefresh = true;
                } else if (showHidden && tarId > -1) {
                    // 干掉相应的正则
                    stData._hideExprs.splice(tarId, 1);
                    needRefresh = true;
                }

                if (needRefresh) {
                    this.slideFrame.que('pannel-file').refreshList();
                }
            },
            showRemoterPannel(e, showRemoterPannel) {
                if (showRemoterPannel) {
                    this.slideFrame.que(`[slide-frame-btn="remoter"]`).class.remove("hide");
                } else {
                    this.slideFrame.que(`[slide-frame-btn="remoter"]`).class.add("hide");
                }
            }
        },
        ready() {
            // 获取相应的
        }
    };
});
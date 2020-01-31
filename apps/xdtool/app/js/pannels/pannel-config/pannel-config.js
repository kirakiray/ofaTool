Component(async (load) => {
    const stData = await load("data/stData");

    return {
        tag: "pannel-config",
        temp: true,
        link: true,
        data: {
            showHiddenFile: false
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
                    this.parents("slide-frame")[0].que('pannel-file').refreshList();
                }
            }
        },
        ready() {
            // 获取相应的
        }
    };
});
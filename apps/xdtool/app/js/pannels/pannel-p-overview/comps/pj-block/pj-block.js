Component(async (load) => {
    let timeUtil = await load('util/timeUtil');

    return {
        tag: "pj-block",
        temp: true,
        data: {
            // 是否激活状态
            active: false,
            // 项目名称
            name: "(empty)",
            // 项目数据
            project: "",
            // 下面是原始数据
            path: "",
            webRootUrl: "",
            addTime: "",
            modifyTime: "",
            // 下面的时间文本
            addTimeText: "",
            modifyTimeText: "",
            // 显示哪个
            showTime: "modifytime",
            // 禁止同步的字段
            _unpush: ["path", "modifyTimeText", "name"],
            _unBubble: ["webRootUrl"]
        },
        attrs: ["active"],
        watch: {
            path(e, val) {
                // 获取最后的名称
                let enames = /.+\/(.+)/.exec(val);

                this.name = enames[1];
            },
            modifyTime(e, val) {
                this.refreshTimeText();
                this.refreshOrder();
            }
        },
        proto: {
            // 更新时间
            refreshTimeText() {
                this.modifyTimeText = timeUtil.getRecentDesc(this.modifyTime);
                this.addTimeText = timeUtil.getRecentDesc(this.addTime);
            },
            // 删掉当前项目
            removeBlock(e) {
                e.bubble = false;
                this.remove();
            },
            // 更新order顺序
            refreshOrder() {
                let nowTime = new Date().getTime();
                switch (this.showTime) {
                    case "addtime":
                        this.style.order = Math.floor((nowTime - this.addTime) / 1000);
                        break;
                    case "modifytime":
                        this.style.order = Math.floor((nowTime - this.modifyTime) / 1000);
                        break;
                }
            }
        }
    }
});
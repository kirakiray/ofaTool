Component(async (load) => {
    let timeUtil = await load('util/timeUtil');

    return {
        tag: "pj-block",
        temp: true,
        link: true,
        data: {
            // 是否激活状态
            active: 0,
            // 项目名称
            name: "(empty)",
            // 下面的时间
            tips: "",
            // 项目数据
            project: "",
            // 下面是原始数据
            path: "",
            modifyTime: "",
            webRootUrl: "",
            // 禁止同步的字段
            _unsync: ["path", "tips", "name", "active"],
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
                this.tips = timeUtil.getRecentDesc(val);
            }
        }
    }
});
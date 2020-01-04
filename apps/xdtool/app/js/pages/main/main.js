Page(async (load) => {
    // 加载主体框架
    await load('comps/pj-block -pack', 'pannel/pannel-info -pack');

    let timeUtil = await load('util/timeUtil');

    // 项目地址
    const projectDatas = [{
        path: "/Users/huangyao/开发/test",
        urlKey: "test",
        modifyTime: 1577911241534
    }, {
        path: "/Users/huangyao/Desktop/随便测试一下",
        urlKey: "suibian",
        modifyTime: 1577971291534
    }];

    return {
        data: {
            // 当前项目的url
            projectUrl: "",
            // 当前项目目录地址
            projectDir: ""
        },
        ready() {
            console.log("初始化成功");

            // 添加项目项目文件
            projectDatas.forEach(e => {
                // 获取最后的名称
                let enames = /.+\/(.+)/.exec(e.path);

                // 生成url地址
                

                this.$pjCon.push({
                    tag: "pj-block",
                    name: e.name || enames[1],
                    tips: timeUtil.getRecentDesc(e.modifyTime),
                    // 项目数据
                    project: e
                });
            });

            // 点击激活状态修正
            this.$pjCon.on("click", 'pj-block', e => {
                let activeTarget = this.queShadow(`pj-block[active="1"]`);

                if (activeTarget === e.delegateTarget) {
                    return;
                }

                // 去掉旧的激活状态
                activeTarget && (activeTarget.active = 0);

                // 添加新的激活状态
                e.delegateTarget.active = 1;
            });

            // 根据激活状态，设置信息
            this.$pjCon.watch(`[active=1]`, (e, tars) => {
                let target = tars[0];
                if (target) {
                    // 设置关键信息
                    this.projectDir = target.project.path;
                }
            }, true);
        }
    };
});
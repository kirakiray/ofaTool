Page(async (load) => {
    // 加载主体框架
    await load('comps/pj-block -pack', 'pannel/pannel-info -pack');

    let timeUtil = await load('util/timeUtil');

    // 项目地址
    const projectData = [{
        path: "/Users/huangyao/开发/test",
        modifyTime: 1577911241534
    }, {
        path: "/Users/huangyao/Desktop/随便测试一下",
        modifyTime: 1577971291534
    }];

    return {
        data: {
            // 当前项目的url
            projectUrl: `http://localhost:9669/test/index.html`
        },
        ready() {
            console.log("初始化成功");

            // 添加项目项目文件
            projectData.forEach(e => {
                this.$pjCon.push({
                    tag: "pj-block",
                    name: "名称",
                    tips: timeUtil.getRecentDesc(e.modifyTime)
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
                tars.forEach(e => {

                });
            }, true);
        }
    };
});
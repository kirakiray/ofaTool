define(async (load) => {
    // 加载主体框架
    await load('comps/pj-block -pack', 'pannels/pannel-info -pack', 'pannels/pannel-file -pack');

    // 项目数据
    let stData = await load("data/stData");

    return {
        temp: true,
        data: {
            // 当前项目的url
            projectUrl: "",
            // 当前项目目录地址
            projectDir: ""
        },
        ready() {
            stData.projects.sync(this.$pjCon, null, true);

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
                    this.projectDir = target.path;
                }
            }, true);
        }
    };
});
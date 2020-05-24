define(async (load) => {
    const { dialog } = require('electron').remote;

    // 获取最近打开的项目
    let openHistory = await storage.getItem("openHistory");

    if (!openHistory) {
        openHistory = {};
        await storage.setItem("openHistory", openHistory);
    }

    // 刷新视图
    function refreshOpenHistory(target) {
        let arr = Object.values(openHistory);

        let fmele = $(document.createDocumentFragment());

        // 排序
        arr = arr.sort((a, b) => b.date - a.date);

        arr.forEach(e => {
            let itemName = e.name;

            if (!itemName) {
                itemName = e.dir.replace(/.+[\/\\](.+)/, "$1");
            }

            let itemEle = $(`
            <div class="p_item" data-dir="${e.dir}">
                <div class="p_item_icon">
                    <div class="p_item_icon_block iconfont"> &#xe60d;</div>
                </div>
                <div class="p_item_info">
                    <div class="p_item_top">
                        <div class="p_item_name">${itemName}</div>
                        <div class="p_item_time">${new Date(e.date).toLocaleString()}</div>
                    </div>
                    <div class="p_item_path">${e.dir}</div>
                </div>
                <div class="p_item_close">×</div>
            </div>
            `);

            fmele.push(itemEle);
        });

        target.html = "";
        target.push(fmele);
    }


    return {
        temp: true,
        css: true,
        data: {},
        async ready() {
            let listEle = this.$shadow.$(".history_list_inner");

            // 刷新视图
            refreshOpenHistory(listEle);

            listEle.on("click", ".p_item_close", e => {
                // 取消跳转页面
                e.cancel = true;

                let { delegateTarget } = e;

                let dir = delegateTarget.parent.data.dir;

                if (dir) {
                    // 删除相应项目
                    delete openHistory[dir];
                    refreshOpenHistory(listEle);
                    storage.setItem("openHistory", openHistory);
                }
            });

            // 点击跳转页面
            listEle.on("click", ".p_item", (e) => {
                let { delegateTarget } = e;

                this.openProject(delegateTarget.data.dir);
            });
        },
        proto: {
            // 添加项目
            async addProject(dir) {
                // 查看是否存在当前项目
                if (!openHistory[dir]) {
                    openHistory[dir] = {
                        dir
                    };
                }

                // 更新时间
                openHistory[dir].date = new Date().getTime();

                // 存储数据
                storage.setItem("openHistory", openHistory);

                // 刷新视图
                refreshOpenHistory(this.$shadow.$(".history_list_inner"));
            },
            // 打开项目
            async openProject(dir) {
                await this.addProject(dir);

                // 跳转到相应页面
                this.navigate({
                    src: "pages/main/main",
                    data: {
                        dir
                    }
                });
            },
            // 打开项目
            clickOpen() {
                // 打开目录
                dialog.showOpenDialog({
                    properties: ['openDirectory']
                }).then(d => {
                    let { filePaths, canceled } = d;
                    if (!canceled) {
                        let path = filePaths[0];

                        // 打开项目
                        this.openProject(path);
                    }
                })
            }
        }
    };
});
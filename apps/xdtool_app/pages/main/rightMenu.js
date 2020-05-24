(() => {
    task(async (load, { _this }) => {
        // 获取右键菜单
        const rightMenu = await load("command/rightmenu -pack");

        _this.$shadow.$('.xt_left').on("contextmenu", "file-block", e => {
            rightMenu([{
                label: '添加 ofa Component',
                click() {
                    console.log('点击文件');
                }
            }, {
                label: '添加 ofa Page',
                click() {
                    console.log('点击文件');
                }
            },
            { type: "separator" },
            {
                label: "剪切",
                disabled: true
            },
            {
                label: "复制",
                disabled: true
            },
            {
                label: "粘贴",
                disabled: true
            },
            { type: "separator" },
            {
                label: "重命名",
                disabled: true
            },
            {
                label: "删除",
                disabled: true
            }
            ], e.originalEvent);
        });
    })
})();
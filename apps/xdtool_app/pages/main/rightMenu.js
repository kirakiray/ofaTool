(() => {
    task(async (load, { _this }) => {
        // 获取右键菜单
        const rightMenu = await load("command/rightmenu -pack");

        _this.$shadow.$('.xt_left').on("contextmenu", "file-block", e => {
            rightMenu([{
                label: '文艺1',
                click() {
                    console.log('点击文件');
                }
            }, {
                label: '文件2',
                click() {
                    console.log('点击文件');
                }
            }, {
                label: '文件3',
                click() {
                    console.log('点击文件');
                }
            }], e.originalEvent);
        });
    })
})();
(() => {
    task(async (load, { _this }) => {
        // 获取右键菜单
        const rightMenu = await load("command/rightmenu -pack");

        _this.$shadow.$('.xt_left').on("contextmenu", "file-block", e => {
            let { delegateTarget } = e;

            rightMenu([{
                label: '添加 ofa Component',
                click() {
                    // 打开当前元素
                    delegateTarget.diropen = true;

                    let inputBlock = $({
                        tag: "file-block",
                        mode: "input",
                        name: "",
                        placeholder: "请输入组件名称"
                    });
                    delegateTarget.unshift(inputBlock);
                    setTimeout(() => {
                        inputBlock.$input.ele.focus();
                        inputBlock.$input.one("blur", e => {
                            inputBlock.mode = "";

                            // 需要新建的是
                            if (inputBlock.name) {
                                console.log("需要新建的组件名 =>", inputBlock.name);
                            }

                            inputBlock.remove();
                        });
                    }, 100);
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
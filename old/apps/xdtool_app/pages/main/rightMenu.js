task(async (load, { _this }) => {
    // 获取右键菜单
    const [rightMenu, addComponentFile] = await load("command/rightmenu -pack", "./util/addComponentFile");

    const addComp = async function (inputBlock) {
        console.log("确认内容输出 => ", inputBlock.name);
        let name = inputBlock.name.trim();

        // 清除输入模式
        inputBlock.mode = "";

        if (!name) {
            inputBlock.remove();
            return 0;
        }

        debugger

        // 对应的目录添加文件
        let data = await addComponentFile({
            name, path
        });

        return 1;
    }

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

                // 失焦删除组件
                inputBlock.$input.one("blur", e => {
                    addComp(inputBlock);
                });

                inputBlock.$input.on("keydown", e => {
                    if (e.originalEvent.keyCode == "13") {
                        addComp(inputBlock);
                    }
                });

                setTimeout(() => {
                    inputBlock.$input.ele.focus();
                }, 100);
            }
        }, {
            label: '添加 ofa Page',
            click() {
                console.log('点击文件');
            }
        }
        ], e.originalEvent);
    });
})
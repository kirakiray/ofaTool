define(async (load) => {
    let stData = await load("data/stData");
    let dialog = await load("command/dialog -pack");

    let shell, clipboard;
    try {
        let elec = require('electron');
        shell = elec.shell;
        clipboard = elec.clipboard;
    } catch (e) {
        console.warn("require shell error => ", e);
    }

    const menuConfig = await load("menuTask/config");

    return (opts) => {
        let { fileBlock } = opts;

        let rightMenuData = [{
            label: `在Finder显示 ${fileBlock.name}`,
            click() {
                let dir = stData.projectData.dir + '/' + fileBlock.getPath();

                shell && shell.showItemInFolder(dir);
            }
        }, {
            label: `浏览器打开`,
            click() {
                let url = stData.projects.seek("[active=1]")[0].webRootUrl + fileBlock.getPath();

                shell.openExternal(url);
            }
        },
        { type: "separator" },
        {
            label: "复制链接",
            click() {
                let url = stData.projects.seek("[active=1]")[0].webRootUrl + fileBlock.getPath();
                clipboard.writeText(url);
                dialog("复制链接成功");
            }
        },
        {
            label: "二维码",
            click() {
                let url = stData.projects.seek("[active=1]")[0].webRootUrl + fileBlock.getPath();
                dialog({
                    type: "ercode",
                    text: url
                });
            }
        }];

        if (/\.html$/.test(fileBlock.name)) {
            rightMenuData.push(
                { type: "separator" },
                {
                    label: "复制链接（remoter）",
                    click() {
                        console.log("inspect 代码");
                        let url = stData.projects.seek("[active=1]")[0].webRootUrl + fileBlock.getPath() + `?__addremote=1`;
                        clipboard.writeText(url);
                        dialog("复制链接（remoter）成功");
                    }
                },
                {
                    label: "二维码（remoter）",
                    click() {
                        let url = stData.projects.seek("[active=1]")[0].webRootUrl + fileBlock.getPath() + `?__addremote=1`;
                        dialog({
                            type: "ercode",
                            text: url
                        });
                    }
                });
        }

        // 配置数据
        menuConfig.forEach(e => {
            rightMenuData.push({ type: "separator" });

            e.list.forEach(e2 => {
                rightMenuData.push({
                    label: e2.label,
                    click() {
                        load(e2.task).post({
                            fileBlock
                        });
                    }
                });
            });
        });


        return rightMenuData;
    }
});
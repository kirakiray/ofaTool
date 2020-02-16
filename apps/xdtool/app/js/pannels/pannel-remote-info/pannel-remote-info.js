Component(async (load) => {
    let stData = await load('data/stData');

    let [rightmenu, dialog] = await load("command/rightmenu -pack", "command/dialog -pack");
    let shell, clipboard;
    try {
        let elec = require('electron');
        shell = elec.shell;
        clipboard = elec.clipboard;
    } catch (e) {
        console.warn("require shell error => ", e);
    }

    return {
        tag: "pannel-remote-info",
        temp: true,
        css: true,
        data: {
            scriptSrc: `http://${stData.ip}:${stData.port}/xdtool/remoter/xdtool_remoter.js`
        },
        proto: {
            clickCopy() {
                if (clipboard) {
                    clipboard && clipboard.writeText(this.scriptSrc);
                    dialog("复制标签成功");
                } else {
                    dialog("复制标签失败，没有权限");
                }
            }
        }
    }
});
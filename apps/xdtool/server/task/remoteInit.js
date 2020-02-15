// 离线调试对象数据
const remoteInit = ({ xdata, stanzAgent }) => {
    // 生成调试对象
    let remoteAgent = stanzAgent.create({
        isRemote: true
    }, "xdtool_remote");

    remoteAgent.on("msg", d => {
        let { data: { data, type }, wsAgent } = d;

        switch (type) {
            case "init":
                // 发送初始化
                wsAgent.sendMsg({
                    type: "initClient",
                    agentId: wsAgent.agentId
                });

                // 添加数据
                let targetBlock = xdata.remotersList.find(e => e.agentId == wsAgent.agentId);

                if (targetBlock) {
                    targetBlock.href = data.href;
                    targetBlock.ua = data.ua;
                }

                break;
            case "console":
                // 中转console指令
                xdata.remoterConsoles[wsAgent.agentId].push({
                    tag: "console-block",
                    methodName: data.methodName,
                    args: JSON.stringify(data.args),
                    stack: data.stack
                });
                break;
        }

        console.log("ondata =>", d);
    });

    // 属于刷新页面的列表，只会存在一次
    const isRefreshList = new Set();

    remoteAgent.on("addWSAgent", wsAgent => {
        if (xdata.remoterConsoles[wsAgent.agentId]) {
            isRefreshList.add(wsAgent.agentId);
            return;
        }

        xdata.remotersList.push({
            tag: "remote-block",
            agentId: wsAgent.agentId,
            name: "",
            href: "",
            ua: ""
        });

        xdata.remoterConsoles[wsAgent.agentId] = {};
        xdata.remoterData[wsAgent.agentId] = {};

        console.log("addWSAgent=>", wsAgent);
    });
    remoteAgent.on("closeWSAgent", wsAgent => {
        if (isRefreshList.has(wsAgent.agentId)) {
            isRefreshList.delete(wsAgent.agentId);
            return;
        }

        let target = xdata.remotersList.find(e => e.agentId === wsAgent.agentId);
        target && target.remove();

        xdata.remoterConsoles[wsAgent.agentId].remove();
        xdata.remoterData[wsAgent.agentId].remove();

        console.log("closeWSAgent=>", wsAgent);
    });

    console.log("remoterXData =>", remoteAgent);
}

exports.remoteInit = remoteInit;
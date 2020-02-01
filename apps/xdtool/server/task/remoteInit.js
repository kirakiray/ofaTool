// 离线调试对象数据
const remoteInit = ({ xdata, stanzAgent }) => {
    // 生成调试对象
    let remoteAgent = stanzAgent.create({
        isRemote: true
    }, "xdtool_remote");

    remoteAgent.on("msg", d => {
        let { data } = d;

        console.log("ondata =>", data);
    });


    remoteAgent.on("addWSAgent", wsAgent => {
        console.log("addWSAgent=>", wsAgent);
    });
    remoteAgent.on("closeWSAgent", wsAgent => {
        console.log("closeWSAgent=>", wsAgent);
    });

    console.log("remoterXData =>", remoteAgent);
}

exports.remoteInit = remoteInit;
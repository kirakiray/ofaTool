drill.define(async (load) => {
    let xdAgent = await stanzAgent("ws://localhost:9866", "100");

    let stData = window.stData = xdAgent.xdata;

    // 添加不需要同步数据
    stData.projects.forEach(e => {
        e._unpush = ["active"];
    });
    stData._unpush = ["projectData"];

    stData.projectData = {
        // 当前项目的url
        url: "",
        // 当前项目目录地址
        dir: ""
    };

    // 监听projects，修正当前项目数据
    stData.projects.watch('[active=1]', (e, tars) => {
        let target = tars[0];
        if (target) {
            // 设置关键信息
            stData.projectData.dir = target.path;
        }
    }, true);

    return xdAgent.xdata;
});
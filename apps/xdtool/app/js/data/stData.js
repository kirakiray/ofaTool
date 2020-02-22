drill.define(async (load) => {
    let xdAgent = await stanzAgent(`ws://${location.hostname}:9866`, "100");

    let stData = window.stData = xdAgent.xdata;

    // 添加不需要同步数据
    stData.projects.watch((e, projects) => {
        projects.forEach(e => {
            e._unpush = ["active"];
        });
    }, true);
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

    // 需要隐藏的文件类型
    stData._hideExprs = [/^\./, /^node_modules$/];

    stData._send = (data) => xdAgent.send(data);

    return xdAgent.xdata;
});
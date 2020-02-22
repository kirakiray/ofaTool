const { getRandowStr, getIPAddress } = require("../common");

// 是否已经存在当前映射目录
const staticMap = new Map();

// 遍历项目并设置静态服务器
let initStaticTimer;
const initStatic = async (xdata, pureServer) => {
    if (initStaticTimer) {
        return;
    }
    initStaticTimer = true;
    await new Promise(res => setTimeout(res, 2000));

    // 重新获取ip地址
    let ip = getIPAddress();

    xdata.projects.forEach(e => {
        // 设置没设置过的项目
        if (!staticMap.has(e.path)) {
            let mapKey = `/s_${getRandowStr()}/`;
            pureServer.setStatic(mapKey, e.path + "/");
            let rootUrl = `http://${ip}:${pureServer.port}${mapKey}`;
            e.webRootUrl = rootUrl;

            staticMap.set(e.path, {
                path: e.path,
                rootUrl, mapKey
            });
        }

        // 反向查找是否删除的项目

    });

    initStaticTimer = false;
}

// 初始化项目静态逻辑
exports.initStaticServer = ({ xdata, pureServer }) => {
    initStatic(xdata, pureServer);

    // 设置ip地址
    xdata.ip = getIPAddress();
    xdata.port = pureServer.port;

    xdata.watch(e => {
        initStatic(xdata, pureServer);
    })

    return () => {
        staticMap.forEach(e => {
            pureServer.removeStatic(e.mapKey);
        })
    }
}
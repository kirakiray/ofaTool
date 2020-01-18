const { getRandowStr } = require("../common");

// 是否已经存在当前映射目录
const staticMap = new Map();

// 遍历项目并设置静态服务器
let initStaticTimer;
const initStatic = async (projects, pureServer) => {
    if (initStaticTimer) {
        return;
    }
    initStaticTimer = true;
    await new Promise(res => setTimeout(res, 2000));

    // 重新获取ip地址
    let ip = getIPAddress();

    projects.forEach(e => {
        // 设置没设置过的项目
        if (!staticMap.has(e.path)) {
            let rootUrl = `/s_${getRandowStr()}`;
            pureServer.setStatic(rootUrl, e.path);
            rootUrl = `http://${ip}${rootUrl}`;
            e.webRootUrl = rootUrl;

            staticMap.set(e.path, {
                path: e.path,
                rootUrl
            });
        }

        // 反向查找是否删除的项目
        
    });

    initStaticTimer = false;
}

// 获取ip地址
const getIPAddress = () => {
    const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
    let IPAddress = '';
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                IPAddress = alias.address;
            }
        }
    }
    return IPAddress;
}

// 初始化项目静态逻辑
exports.initStaticServer = (projects, pureServer) => {
    initStatic(projects, pureServer);

    projects.watch(e => {
        initStatic(projects, pureServer);
    })
}

exports.clearStaticServer = (projects, pureServer) => {
    debugger
}
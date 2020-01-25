// 路由数组
const routers = [];

// 静态服务器初始化函数
const { initStaticServer, clearStaticServer } = require("./task/initStaticServer");
const { initOpenDir } = require("./task/openDir");

// 注册函数
exports.register = async (opts) => {
    let { pureServer, sAgent } = opts;

    // 项目数据
    sAgent.xdata.projects = [{
        // tag: "pj-block",
        path: "/Users/huangyao/开发/test",
        urlKey: "test",
        modifyTime: 1577911241534,
        // 目录结构
        dirs: []
    }, {
        // tag: "pj-block",
        path: "/Users/huangyao/Desktop/随便测试一下",
        modifyTime: 1577971291534,
        // 目录结构
        dirs: []
    }];

    // 静态服务器初始化服务
    initStaticServer(sAgent.xdata.projects, pureServer);
    initOpenDir(sAgent.xdata.projects, pureServer);
}

// 注销函数
exports.unregister = ({
    pureServer, sAgent
}) => {
    // 注销所有接口
    routers.forEach(e => {
        e.remove();
    });

    // 清空存储器
    routers.length = 0

    // 清除静态服务资源
    clearStaticServer(sAgent.xdata.projects, pureServer);
}
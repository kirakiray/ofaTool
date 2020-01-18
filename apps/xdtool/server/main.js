// 路由数组
const routers = [];

const { initStaticServer } = require("./task/initStaticServer");

// 注册函数
exports.register = async (opts) => {
    let { pureServer, sAgent } = opts;

    // 项目数据
    sAgent.xdata.projects = [{
        tag: "pj-block",
        path: "/Users/huangyao/开发/test",
        urlKey: "test",
        modifyTime: 1577911241534
    }, {
        tag: "pj-block",
        path: "/Users/huangyao/Desktop/随便测试一下",
        modifyTime: 1577971291534
    }];

    // 静态服务器初始化服务
    initStaticServer(sAgent.xdata.projects, pureServer);
}

// 注销函数
exports.unregister = () => {
    // 注销所有接口
    routers.forEach(e => {
        e.remove();
    });

    // 清空存储器
    routers.length = 0
}
// 路由数组
const routers = [];

// 添加项目接口初始化
const addProjectInit = require("./addProject");

// 注册函数
exports.register = async (opts) => {
    let { pureServer, sAgent } = opts;

    // 添加项目
    routers.push(await addProjectInit(pureServer));
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
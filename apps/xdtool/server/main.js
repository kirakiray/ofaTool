// 路由数组
const routers = [];
const getRandomId = () => Math.random().toString(32).substr(2);

// 静态服务器初始化函数
const { initStaticServer, clearStaticServer } = require("./task/initStaticServer");
const { initOpenDir } = require("./task/openDir");

// 注册函数
exports.register = async (opts) => {
    let { pureServer, sAgent } = opts;

    let xdata = sAgent.xdata;

    const tSotrage = await ofaStorage.getStorage("ofaStorage");

    // 获取数据
    let projectsData = await tSotrage.getItem("projects");

    if (!projectsData) {
        projectsData = [];
        await tSotrage.setItem("projects", []);
    }

    // 项目数据
    xdata.projects = projectsData;

    // 监听变动
    xdata.projects.watch((e, projects) => {
        // 保存项目记录
        tSotrage.setItem("projects", projects.object);
    });

    // 目录对象数据
    xdata.dirs = {};

    // 静态服务器初始化服务
    initStaticServer(xdata, pureServer);

    // 初始化文件系统
    let rs = initOpenDir(xdata, pureServer);
    routers.push(...rs)
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
    clearStaticServer(sAgent.xdata, pureServer);
}
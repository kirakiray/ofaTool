// 路由数组
const getRandomId = () => Math.random().toString(32).substr(2);

// 静态服务器初始化函数
const { initStaticServer } = require("./task/initStaticServer");
const { initOpenDir } = require("./task/openDir");
const { remoteInit } = require("./task/remoteInit");

const clearCalls = [];

// 注册函数
exports.register = async (opts) => {
    let { pureServer, sAgent, stanzAgent } = opts;

    // 主要程序代理数据对象
    let xdata = sAgent.xdata;

    const tSotrage = await ofaStorage.getStorage("ofaStorage");

    // 获取项目列表数据
    let projectsData = await tSotrage.getItem("projects");

    if (!projectsData) {
        projectsData = [];
        await tSotrage.setItem("projects", []);
    }

    // 项目数据
    xdata.projects = projectsData;

    // 项目列表数据保存机制
    xdata.projects.watch((e, projects) => {
        // 保存项目记录
        tSotrage.setItem("projects", projects.object);
    });

    // 目录对象数据
    xdata.dirs = {};

    // 离线端数据
    xdata.remotersList = {}

    // 记录console数据
    xdata.remoterConsoles = {};

    // 记录常规数据
    xdata.remoterData = {};

    // 静态服务器初始化服务
    clearCalls.push(initStaticServer({ xdata, pureServer }));

    // 初始化文件系统
    clearCalls.push(initOpenDir({ xdata, pureServer }));

    // 初始化离线调试对象
    clearCalls.push(remoteInit({ xdata, stanzAgent }));
}

// 注销函数
exports.unregister = ({
    pureServer, sAgent
}) => {
    clearCalls.forEach(e => e());

    clearCalls.length = 0;
}
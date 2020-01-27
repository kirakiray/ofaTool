const fs = require("fs").promises;

// 获取相应目录的数据
const getDirBlockData = async (opts = {}) => {
    let {
        // 目录地址
        path,
        // 查询目录深度级别
        deep = 1,
        // 忽略的目录名
        ingnores = ["node_modules"]
    } = opts;

    let dirs = await fs.readdir(path);

    let dirsData = [];

    await Promise.all(dirs.map(async name => {
        // 判断文件是否dir
        let fPath = `${path}/${name}`;

        let statData = await fs.stat(fPath);
        let isDir = statData.isDirectory();

        // 添加项目对象
        let fxd = {
            tag: "file-block",
            name,
            isDir
        };

        // 文件夹读取
        if (isDir && deep && !ingnores.includes(name)) {
            let childs = await getDirBlockData({
                path: fPath,
                deep: deep - 1
            });

            childs.forEach((e, i) => {
                // fxd.push(e);
                fxd[i] = e;
            });
        }

        dirsData.push(fxd);
    }));

    return dirsData;
}

const openedProjects = new Set();

// 打开项目
const openProject = async (d, xdata) => {
    let target = xdata.projects.find(e => e.path === d.data.path);

    if (openedProjects.has(target.path)) {
        return {
            stat: 1
        }
    }

    openedProjects.add(target.path);

    // 读取首层目录
    let dirs = await getDirBlockData({
        path: target.path,
        deep: 100
    });

    // 写入相应的目录数据
    xdata.dirs[target.dirId] = dirs;

    return {
        stat: 1
    };
}

// 关于项目内的打开文件目录树的行为
exports.initOpenDir = (xdata, pureServer) => {
    let routers = [];

    // 添加刷新接口
    let dirRouter = pureServer.route(`/refresh_xdtool_dir`);
    routers.push(dirRouter);

    // 获取项目
    dirRouter.post(async (ctx) => {
        let { data } = ctx;

        switch (data.type) {
            case "openProject":
                ctx.body = await openProject(data, xdata);
                break;
        }
        ctx.body = JSON.stringify(ctx.body);
        ctx.respType = "json";
    });

    return routers;
}
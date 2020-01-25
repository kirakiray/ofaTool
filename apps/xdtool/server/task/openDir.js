const fs = require("fs").promises;
const stanz = require("../../../../server/node/StanzAgent/stanz");

// 获取相应目录的数据
const getDirBlockData = async (opts = {}) => {
    let {
        // 目录地址
        path,
        // 查询目录深度级别
        deep = 2,
    } = opts;

    let dirs = await fs.readdir(path);

    let dirsData = [];

    await Promise.all(dirs.map(async name => {
        // 判断文件是否dir
        let fPath = `${path}/${name}`;

        let statData = await fs.stat(fPath);
        let isDir = statData.isDirectory();

        // 添加项目对象
        // let fxd = stanz({
        //     tag: "file-block",
        //     name,
        //     isDir
        // });
        let fxd = {
            tag: "file-block",
            name,
            isDir
        };

        // 文件夹读取
        if (isDir && deep) {
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

// 关于项目内的打开文件目录树的行为
exports.initOpenDir = (projects, pureServer) => {
    projects.forEach(async e => {
        // 读取首层目录
        let dirs = await getDirBlockData({
            path: e.path
        });

        e.dirs = dirs;
    });
}
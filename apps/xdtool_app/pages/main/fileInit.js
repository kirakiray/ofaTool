// 项目读取
(() => {
    const orFs = require("fs");
    const fs = orFs.promises;

    // 读取单个目录的数据
    const readProject = async (dir, deepCount = 1) => {
        // 读取目录
        let list = await fs.readdir(dir);

        --deepCount;

        // 转换dir数组数据为组件数据
        let arr = [];
        await Promise.all(list.map(async e => {
            // 判断文件是否是目录
            let stat = await fs.stat(`${dir}/${e}`);

            // 组件数据
            let compData;

            if (stat.isDirectory()) {
                compData = $({
                    tag: "file-block",
                    name: e,
                    isDir: 1
                });

                // 读取多一级目录
                if (deepCount > 0) {
                    let childs_arr = await readProject(`${dir}/${e}`, deepCount);
                    compData.push(...childs_arr);

                    compData.loaded = 1;
                }

            } else {
                compData = $({
                    tag: "file-block",
                    name: e
                });
            }

            if (compData) {
                arr.push(compData);
            }
        }));

        return arr;
    }

    // 测试地址
    let testDir = "/Users/huangyao/Documents/GitHub/XDTool/apps/xdtool_app";

    task(async (load, { _this, dir }) => {
        let projectEles = await readProject(dir || testDir, 2);

        // 添加元素
        _this.$dirMain.push(...projectEles);

        _this.$dirMain.on("toggleDir", (e, data) => {
            // 低一层进行加载
            e.target.forEach(fileBlock => {
                if (fileBlock.isDir && !fileBlock.loaded) {
                    // 触发数据加载方法
                    fileBlock.loaded = "loading";
                }
            });
        });

        // 监听加载状态，对目录进行读取
        _this.$dirMain.watch(e => {
            e.trends.forEach(async trend => {
                if (trend.name == "setData" && trend.args[0] == "loaded" && trend.args[1] == 'loading') {
                    // 加载目录
                    let target = _this.$dirMain;
                    trend.keys.forEach(k => {
                        target = target[k];
                    });

                    if (target.isDir && target.isDir == 1) {
                        // 读取路径
                        let newDir = testDir + "/" + target.getPath();

                        let arr = await readProject(newDir);

                        target.push(...arr)

                        target.loaded = 1;
                    }

                }
            });
        });
    });
})()

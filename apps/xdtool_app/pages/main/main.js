define(async (load) => {
    await load("comps/file-block -pack");

    const fs = require("fs").promises;

    // 测试地址
    let testDir = "/Users/huangyao/Documents/GitHub/XDTool";

    const getWidth = (width, maxWidth) => {
        if (width < 200) {
            width = 200
        } else if (width > maxWidth) {
            width = maxWidth;
        }
        return width;
    }

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

    return {
        temp: true,
        data: {},
        css: true,
        proto: {
        },
        async ready() {
            let projectEles = await readProject(testDir, 2);

            // 添加元素
            this.$dirMain.push(...projectEles);

            this.$dirMain.on("toggleDir", (e, data) => {
                // 低一层进行加载
                e.target.forEach(fileBlock => {
                    if (fileBlock.isDir && !fileBlock.loaded) {
                        // 触发数据加载方法
                        fileBlock.loaded = "loading";
                    }
                });
            });

            // 监听加载状态，对目录进行读取
            this.$dirMain.watch(e => {
                e.trends.forEach(async trend => {
                    if (trend.name == "setData" && trend.args[0] == "loaded" && trend.args[1] == 'loading') {
                        // 加载目录
                        let target = this.$dirMain;
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

            // 左边改变宽度的方法
            let oWidth;
            const xtLeft = this.$shadow.$(".xt_left");
            let startX = 0, startWidth = 0, maxWidth = window.innerWidth * 0.6, width = 260;
            const mouseMove = (e) => {
                let event = e.originalEvent;
                let diffX = event.pageX - startX;
                width = startWidth + diffX;

                width = getWidth(width, maxWidth);

                xtLeft.style.width = width + "px";
            }

            const mouseUp = (e) => {
                $("body").off("mousemove", mouseMove);
                $("body").off("mouseup", mouseUp);
            }

            this.$shadow.$(".left_sizer").on("mousedown", e => {
                let event = e.originalEvent;
                startX = event.pageX;
                startWidth = xtLeft.width;
                maxWidth = window.innerWidth * 0.6;

                // 在body上绑定
                $("body").on("mousemove", mouseMove);
                $("body").on("mouseup", mouseUp);
            })

            // 设置初始值
            if (oWidth) {
                xtLeft.style.width = getWidth(oWidth, maxWidth) + "px";
            }
        }
    };
});
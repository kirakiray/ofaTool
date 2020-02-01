define(async (load) => {
    // 加载主体框架
    await load('pannels/pannel-info -pack', 'pannels/pannel-file -pack', "pannels/pannel-p-overview -pack", "pannels/pannel-config -pack", "comps/slide-frame -pack","pannels/pannel-remote -pack");

    let storage = await load("util/ofaStorage");

    // 获取宽度
    let oWidth = await storage.getItem("main_xt_left_width");

    // 项目数据
    let stData = await load("data/stData");

    const getWidth = (width, maxWidth) => {
        if (width < 200) {
            width = 200
        } else if (width > maxWidth) {
            width = maxWidth;
        }
        return width;
    }

    return {
        temp: true,
        link: true,
        data: {
            // 是否隐藏左边工具栏
            hideFrameLeft: true,
            // 激活中的pannel
            activePannel: "projects"
        },
        watch: {},
        ready() {
            // 在有dir的情况下可以切换标签
            stData.projectData.watch("dir", (e, val) => {
                setTimeout(() => {
                    this.hideFrameLeft = !val;
                }, 100);
            });

            // 鼠标控制文件区域
            const xtLeft = this.queShadow(".xt_left");
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

                storage.setItem("main_xt_left_width", width);
            }

            this.$xfLine.on("mousedown", e => {
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
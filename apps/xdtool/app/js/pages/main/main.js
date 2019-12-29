Page(async (load) => {
    // 加载主体框架
    await load('comps/pj-block -pack');

    return {
        data: {
            ha: "hahaha"
        },
        ready() {
            console.log("初始化成功");
        }
    };
});
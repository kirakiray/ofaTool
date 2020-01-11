drill = async (drill) => {
    // 定义主体目录
    drill.config({
        baseUrl: "js/"
    });

    window.stanz = $.xdata;

    // 加载基础库
    await load("util/ofaStorage", "util/StanzClientAgent");

    // 载入主体frame
    await load('comps/ele-frame -pack');

    // 初始加载stanz库
    let stData = await load("data/stData");

    console.log("stData => ", stData);
}
drill = async (drill) => {
    // 定义主体目录
    drill.config({
        baseUrl: "js/"
    });

    // 加载基础库
    await load("util/ofaStorage");

    // 载入主体frame
    await load('comps/ele-frame -pack');
}
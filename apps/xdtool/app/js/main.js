drill = async (drill) => {
    // 定义主体目录
    drill.config({
        baseUrl: "js/"
    });

    window.stanz = $.xdata;

    ofa.globalcss = "css/global.css";

    // 加入页面
    $('ele-frame xd-page').src = "js/pages/main/main.js";

    // 加载基础库
    await load("util/ofaStorage", "remoter/StanzClientAgent -r");

    // 载入主体frame
    await load('comps/ele-frame -pack');

    // 初始加载stanz库
    let stData = await load("data/stData");

    // 判断页面是否显示返回按钮
    $("xd-app").on("navigate", (e, d) => {
        if ($('xd-app').currentPages.length > 1) {
            $('ele-frame').hideBack = false;
        } else {
            $('ele-frame').hideBack = true;
        }
    });

    // 慢行1秒
    setTimeout(() => {
        $("#startLoading").class.add("hide");
        setTimeout(() => {
            $("#startLoading").remove();
        }, 300);
    }, 100);

    console.log("stData => ", stData);
}
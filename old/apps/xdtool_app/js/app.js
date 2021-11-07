ofa = async () => {
    let [, ofaStorage] = await load(`comps/ele-frame -pack`, "js/ofaStorage");
    window.storage = ofaStorage.getStorage("xdtool");

    // 初始化后添加首页
    $('xd-app').push(`<xd-page src="pages/welcome/welcome"></xd-page>`);

    // 设置公用css
    ofa.globalcss = "css/global.css";

    // 慢行1秒
    setTimeout(() => {
        $("#startLoading").class.add("hide");
        setTimeout(() => {
            $("#startLoading").remove();
        }, 300);
    }, 100);
}
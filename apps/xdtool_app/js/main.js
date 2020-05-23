ofa = async () => {
    let [, ofaStorage] = await load(`comps/ele-frame -pack`, "js/ofaStorage");
    window.ofaStorage = ofaStorage;

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
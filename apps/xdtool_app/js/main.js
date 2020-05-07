ofa = async () => {
    ofa.config({
        baseUrl: "js/"
    });

    load(`comps/ele-frame -pack`);

    // 慢行1秒
    setTimeout(() => {
        $("#startLoading").class.add("hide");
        setTimeout(() => {
            $("#startLoading").remove();
        }, 300);
    }, 100);
}
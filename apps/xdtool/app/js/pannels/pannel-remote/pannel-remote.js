Component(async (load) => {
    const stData = await load("data/stData");

    await load("./comps/remote-block -pack");

    return {
        tag: "pannel-remote",
        temp: true,
        link: true,
        ready() {
            // 获取离线端数据并设置
            stData.remotersList.sync(this.$list, null, true);
        }
    };
});
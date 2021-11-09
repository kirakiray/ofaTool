Page(async ({ load }) => {
    return {
        data: {
            // 当前的项目地址
            projectDir: "/Users/huangyao/Documents/GitHub/ofaTool/",
            // 已开启的业务
            panels: [{
                name: "serverHelper",
                icon: "",
                src: "pages/serverHelper/serverHelper.js?aaa=1"
            }],
            // 已激活的id
            activeId: 0
        },
        proto: {
        },
        ready() {
        }
    };
});
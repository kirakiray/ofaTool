module.exports = async (pureServer) => {
    // 注册接口初始接口
    let router = pureServer.route(`/xdtool/addProject`);

    // 获取项目
    router.post(async (ctx) => {
        ctx.body = JSON.stringify({
            ha: "hahahaha"
        });
        ctx.respType = "json";
    });

    return router;
}
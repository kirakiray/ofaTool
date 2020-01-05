module.exports = async (runningServer) => {
    // 注册接口初始接口
    let router = runningServer.route(`/xdtool/addProject`);

    // 获取项目
    router.post(async (ctx) => {
        ctx.body = JSON.stringify({
            ha: "hahahaha"
        });
        ctx.respType = "json";
    });

    return router;
}
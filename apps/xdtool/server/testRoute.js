module.exports = async (pureServer) => {
    // 注册接口初始接口
    let setStaticRouter = pureServer.route(`/xdtool/setStatic`);

    // 获取项目
    setStaticRouter.post(async (ctx) => {
        debugger
        ctx.body = JSON.stringify({
            ha: "hahahaha"
        });
        ctx.respType = "json";
    });

    return [setStaticRouter];
}
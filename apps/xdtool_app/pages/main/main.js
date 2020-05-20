define(async (load) => {
    await load("comps/file-block -pack");

    return {
        temp: true,
        data: {},
        css: true,
        proto: {
        },
        async ready() {
            load("./resizeLeft", "./fileInit", "./rightMenu").post({
                _this: this
            });
        }
    };
});
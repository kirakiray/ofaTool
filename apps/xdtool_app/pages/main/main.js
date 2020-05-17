define(async (load) => {
    await load("comps/file-block -pack");

    const fs = require("fs").promises;

    // 测试地址
    let testDir

    return {
        temp: true,
        data: {},
        css: true
    };
});
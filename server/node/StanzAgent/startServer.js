// 生成stanz对象
let saobj = stanzAgent.create({
    a: "aaaaaa"
}, "100");

saobj.on("msg", e => {
    console.log("得到的数据 => ", e);

    // 一秒后返回数据
    setTimeout(() => {
        // saobj.sendAll({
        e.send({
            val: "我得到了"
        });
    }, 1000);
});

Component(async (load) => {
    await load("./comps/console-block -pack");

    let stData = await load("data/stData");

    return {
        tag: "pannel-console",
        temp: true,
        css: true,
        data: {
            agentId: ""
        },
        ready() {
            this.$consoleInput.on('keydown', e => {
                if (e.originalEvent.keyCode == 13) {
                    // 按下了回车
                    let runcode = this.$consoleInput.ele.value;
                    console.log("runcode=>", runcode);

                    stData._send({
                        type: "runcode",
                        agentId: this.agentId,
                        runcode
                    });

                    // 清空值
                    this.$consoleInput.ele.value = "";

                    e.preventDefault();
                }
            })
        }
    };
});
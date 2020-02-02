(async () => {
    // 当前窗口的agentId
    let aid = "";

    let xdAgent = await stanzAgent("ws://localhost:9866", {
        id: "xdtool_remote"
    });

    window.xdAgent = xdAgent;

    xdAgent.send({
        type: "init",
        data: {
            href: location.href,
            ua: navigator.userAgent
        }
    });

    xdAgent.receive(d => {
        let { agentId, type } = d;
        switch (type) {
            case "initClient":
                aid = agentId;
                break;
        }
        console.log("d=>", d);
    });
})();
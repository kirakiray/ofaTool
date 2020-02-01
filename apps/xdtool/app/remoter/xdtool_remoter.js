(async () => {
    let xdAgent = await stanzAgent("ws://localhost:9866", "xdtool_remote");
    // let xdAgent = await stanzAgent("ws://192.168.0.106:9866", "100");
    window.xdAgent = xdAgent;
})();
drill.define(async (load) => {
    let xdAgent = await stanzAgent("ws://localhost:9866", "100");

    window.stData = xdAgent.xdata;

    return xdAgent.xdata;
});
drill.define(async (load) => {
    let xdAgent = await stanzAgent("ws://localhost:9866", "100");

    return xdAgent.xdata;
});
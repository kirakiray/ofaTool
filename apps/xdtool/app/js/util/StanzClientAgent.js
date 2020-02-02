((glo) => {
    class StanzClientAgent {
        constructor() {
            Object.assign(this, {
                // socketId
                id: null,
                agentId: null,
                _ws: null,
                _receives: [],
                timer: "",
                xdata: null,
                loaded: false
            });
        }
        // 设置远端服务器地址
        set url(url) {
            if (!this.id) {
                throw {
                    desc: "id must exist"
                };
            }

            let socketUrl = `${url}?id=${this.id}`;

            if (this.agentId) {
                socketUrl += `&agentId=${this.agentId}`;
            }

            // 添加参数
            let ws = this._ws = new WebSocket(socketUrl);

            // 回音历史数据
            let historyTrends = new Set();

            ws.onopen = () => {
                ws.send(transData({
                    type: "init"
                }));
            }

            ws.onmessage = e => {
                let d = {};
                try {
                    d = JSON.parse(e.data);
                } catch (e) {
                    console.error("error data => ", e);
                    return
                }

                switch (d.type) {
                    case "init":
                        if (typeof stanz === "undefined") {
                            console.log("stanz is undefined!!!!!!!!!!!!!!!!!!!!!!!!!");
                            this.loaded = true;
                            this.onload()
                            return;
                        }
                        // 初始化
                        let xdata = this.xdata = stanz(d.data);
                        this.loaded = true;

                        // 对象变动监听，发送变动
                        xdata.watch(e => {
                            // 回音过滤
                            let newTrends = e.trends.filter(trend => {
                                if (!historyTrends.has(trend.mid) && !trend._unpush) {
                                    return true;
                                }
                            });

                            if (!newTrends.length) {
                                return
                            }

                            ws.send(transData({
                                type: "upxdata",
                                data: newTrends
                            }));
                        });

                        this.onload()
                        break;
                    case "msg":
                        // 接受数据
                        this._receives.forEach(f => f(d.data));
                        break;
                    case "upxdata":
                        // 数据同步
                        console.log("同步数据来了");
                        d.data.forEach(trend => {
                            historyTrends.add(trend.mid);
                            this.xdata.entrend(trend);
                        });
                        break;
                    case "pong":
                        // 心跳设置
                        break;
                }
            }

            ws.onclose = () => {
                clearInterval(this.timer);
            }

            // 心跳设置
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                ws.send(transData({
                    type: "ping"
                }));
            }, 30000);
        }

        // 发送数据
        send(data) {
            this._ws.send(transData({
                type: "msg",
                data
            }));
        }

        // 接受数据
        receive(callback) {
            this._receives.push(callback);
        }

        onload() { }
        onerror() { }
    }

    // 转换数据
    const transData = (obj) => {
        return JSON.stringify(obj);
    }

    glo.stanzAgent = (url, id) => {
        return new Promise((resolve, reject) => {
            let sdata = new StanzClientAgent();

            if (typeof id === "object") {
                let obj = id;
                sdata.id = String(obj.id);
                obj.agentId && (sdata.agentId = obj.agentId);
            } else {
                sdata.id = String(id);
            }

            sdata.onload = () => { resolve(sdata) }
            sdata.onerror = () => { reject() }
            sdata.url = url;
        });
    }
})(window);
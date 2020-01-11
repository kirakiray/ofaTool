const wsObj = require("./wsServer");
const stanz = require("./stanz");
const EventEmitter = require('events');

class StanzServerAgent {
    _agents = new Map();

    constructor() {
        // 对接服务
        let wsServer = this._wsServer = new wsObj.wsServer();

        // 监听变动
        wsServer.on("message", e => {
            let { data, type } = e.d;
            let { id } = e.wsAgent;
            let stanzAgent;
            switch (type) {
                case "init":
                    stanzAgent = this._agents.get(id);
                    // 获取初始化数据
                    e.wsAgent.send({
                        type: "init",
                        data: stanzAgent.xdata.object
                    })
                    break;
                case "upxdata":
                    stanzAgent = this._agents.get(id);

                    // 更新数据
                    data.forEach(trend => {
                        stanzAgent.xdata.entrend(trend);
                    });
                    break;
                case "msg":
                    // 消息接送
                    stanzAgent = this._agents.get(id);
                    stanzAgent.emit("msg", {
                        data,
                        // 单独返回的方法
                        send: (data) => e.wsAgent.send({
                            type: "msg",
                            data
                        })
                    });
                    break
                case "ping":
                    // 心跳设置
                    e.wsAgent.send({
                        type: "pong"
                    })
                    break;
            }
        });
    }

    // port代理
    set port(val) {
        this._wsServer.port = val;
    }

    /**
     * 生成stanz实例对象
     * @param {Object} obj stanz数据对象
     * @param {String} id stanz数据对象的id
     */
    create(obj = {}, id) {
        // 添加允许的id
        this._wsServer.addPermitID(id);

        let sAgent = new StanzAgent({ obj, id, host: this });

        sAgent.xdata.watch(e => {
            sAgent.sendAll(e.trends, "upxdata");
        });

        this._agents.set(id, sAgent);

        return sAgent;
    }
}

class StanzAgent extends EventEmitter {
    constructor({ obj, id, host }) {
        super();
        this.xdata = stanz(obj);
        this.id = id;
        this.host = host;
    }

    // 发送给所有对象
    sendAll(data, type = "msg") {
        this.host._wsServer.sendAll({
            type,
            data
        }, this.id);
    }
}

exports.StanzServerAgent = StanzServerAgent;
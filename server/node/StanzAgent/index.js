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
            let { socketId } = e.wsAgent;
            let stanzAgent;
            switch (type) {
                case "init":
                    stanzAgent = this._agents.get(socketId);
                    // 获取初始化数据
                    e.wsAgent.send({
                        type: "init",
                        data: stanzAgent.xdata.object
                    })
                    break;
                case "upxdata":
                    stanzAgent = this._agents.get(socketId);

                    // 更新数据
                    data.forEach(trend => {
                        stanzAgent.xdata.entrend(trend);
                    });
                    break;
                case "msg":
                    // 消息接送
                    stanzAgent = this._agents.get(socketId);
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

        wsServer.on("addWSAgent", wsAgent => {
            let stanzAgent = this._agents.get(wsAgent.socketId);
            stanzAgent.emit("addWSAgent", wsAgent);
        });
        wsServer.on("closeWSAgent", wsAgent => {
            let stanzAgent = this._agents.get(wsAgent.socketId);
            stanzAgent.emit("closeWSAgent", wsAgent);
        });
    }

    // port代理
    set port(val) {
        this._wsServer.port = val;
    }

    /**
     * 生成stanz实例对象
     * @param {Object} obj stanz数据对象
     * @param {String} socketId stanz数据对象的socketId
     */
    create(obj = {}, socketId) {
        let sAgent = this._agents.get(socketId);

        if (!sAgent) {
            // 添加允许的socketId
            this._wsServer.addPermitID(socketId);

            sAgent = new StanzAgent({ obj, socketId, host: this });

            sAgent.xdata.watch(e => {
                sAgent.sendAll(e.trends, "upxdata");
            });

            this._agents.set(socketId, sAgent);
        }

        return sAgent;
    }
}

class StanzAgent extends EventEmitter {
    constructor({ obj, socketId, host }) {
        super();
        this.xdata = stanz(obj);
        this.socketId = socketId;
        this.host = host;
    }

    // 发送给所有对象
    sendAll(data, type = "msg") {
        this.host._wsServer.sendAll({
            type,
            data
        }, this.socketId);
    }
}

exports.StanzServerAgent = StanzServerAgent;
exports.stanz = stanz;
const WebSocket = require('faye-websocket'),
    http = require('http');
const URL = require("url");
const querystring = require("querystring");
const EventEmitter = require('events');

class wsServer extends EventEmitter {
    constructor() {
        super();
    }

    server = null;
    _wsSet = new Set();
    _wsMap = new Map();

    set port(port) {
        if (this.server) {
            return;
        }

        let server = this.server = http.createServer();

        server.on('upgrade', async (request, socket, body) => {
            // 获取对象及参数数据
            let urlObj = URL.parse(request.url);
            let params = querystring.parse(urlObj.query);

            // 允许数据参数
            let permitData = await this.onpermit({
                request, params
            });

            if (WebSocket.isWebSocket(request) && permitData.stat) {
                let socketId = params.id;

                let targetSets = this._wsMap.get(socketId);

                if (!targetSets) {
                    // 授权不通过
                    socket.end();
                    return;
                }

                var ws = new WebSocket(request, socket, body);

                let wsData = new WSAgent(ws, socketId);

                if (params.agentId) {
                    wsData.agentId = params.agentId;
                }

                // 添加到队列
                targetSets.add(wsData);

                // 通道接受到数据
                wsData.onmessage = (d) => {
                    this.emit("message", {
                        d: d,
                        wsAgent: wsData
                    });
                }

                // 通道关闭
                wsData.onclose = (event) => {
                    console.log('close', event.code, event.reason);
                    // 回收对象
                    this._wsMap.get(socketId).delete(wsData);
                    this.emit("closeWSAgent", wsData);
                    wsData = ws = null;
                }

                this.emit("addWSAgent", wsData);
            } else {
                // 授权不通过
                socket.end();
            }
        });

        server.listen(port);
    }

    // 设定允许介入的socketId
    addPermitID(socketId) {
        let tarSets = this._wsMap.get(socketId);
        if (!tarSets) {
            tarSets = new Set();
            this._wsMap.set(socketId, tarSets);
        }
        return tarSets;
    }

    // 删除允许传入的socketId
    deletePermitID(socketId) {
        let tarSets = this._wsMap.get(socketId);
        if (tarSets) {
            tarSets.forEach(e => {
                e._ws.close();
            });

            this._wsMap.delete(socketId);
        }
    }

    // 授权带入
    onpermit() {
        return Promise.resolve({
            stat: 1
        });
    }

    // 发送数据
    sendAll(data, socketId = "") {
        let tarSets = this._wsMap.get(socketId);

        if (tarSets) {
            tarSets.forEach(wsData => {
                wsData.send(data);
            });
        } else {
            // 不可能存在没回收的对象
            debugger
        }
    }
}

// 代理对象
class WSAgent {
    constructor(ws, socketId) {
        this._ws = ws;
        this.agentId = Math.random().toString(32).slice(2);
        this.socketId = socketId;

        ws.on("message", event => {
            this.onmessage(JSON.parse(event.data));
        });

        ws.on("close", e => this.onclose(e));
    }

    // 发送消息ƒ
    send(data) {
        this._ws.send(JSON.stringify(data));
    }

    // 得到消息
    onmessage(data) { }
    // 关闭
    onclose() { }
}

exports.wsServer = wsServer;
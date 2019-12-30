const URL = require("url");
const querystring = require("querystring");

class Route {
    constructor(target, path) {
        this._target = target;
        this._path = path;

        // 主体设置对象
        let obj = this._obj = {
            // 监听数组函数
            sets: []
        }

        // 加入路由
        target._entrance.set(path, obj);
    }
    // get请求
    get(asyncFunc) {
        this._obj.sets.push({
            type: "get",
            func: asyncFunc
        });
        return this;
    }
    // post请求
    post(asyncFunc) {
        this._obj.sets.push({
            type: "post",
            func: asyncFunc
        });
        return this;
    }
    // 清除路由
    remove() {
        this._target._entrance.delete(this._path);
    }
}

module.exports = {
    proto: {
        // 路由存放地址
        _entrance: new Map(),
        // 设置路由
        route(path) {
            return new Route(this, path);
        }
    },
    async skin(ctx, next) {
        // 获取目标
        let targetEntrancer = this._entrance.get(ctx.pathname);

        if (targetEntrancer) {
            // 运行队列内callback
            let { sets } = targetEntrancer;

            for (let o of sets) {
                await o.func(ctx);
            }
        }
    }
};
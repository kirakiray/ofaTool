const URL = require("url");
const querystring = require("querystring");

// 获取post的数据
const getPostData = (req) => new Promise((reslove, reject) => {
    let body = "";
    // isBuffer;
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        let data;
        let contentType = req.headers['content-type'];
        switch (contentType) {
            case "application/x-www-form-urlencoded":
                data = querystring.parse(body);
                break;
            case "application/json":
                data = JSON.parse(body);
                break;
            case "text/plain":
                data = body;
                break;
        }
        reslove(data);
    });
});

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

            // 获取方式
            let method = ctx.request.method.toLowerCase();

            switch (method) {
                case "post":
                    let postData = await getPostData(ctx.request);
                    ctx.data = postData;
                    break;
            }
            await Promise.all(sets.map(e => {
                if (e.type.toLowerCase() === method) {
                    return e.func(ctx);
                } else {
                    return Promise.resolve("");
                }
            }));

            // for (let o of sets) {
            //     await o.func(ctx);
            // }
        }
    }
};
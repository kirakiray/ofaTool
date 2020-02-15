(async () => {
    // 获取url参数
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }

    // 当前窗口的agentId
    let aid = getQueryVariable("agentId");

    if (!aid) {
        history.pushState({}, "", "?agentId=a" + Math.random().toString(32).slice(2))
    }

    let xdAgent = await stanzAgent(`ws://${location.hostname}:9866`, {
        id: "xdtool_remote",
        agentId: aid
    });

    window.xdAgent = xdAgent;

    // 初始化信息
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
    });

    // 获取虚拟对象的方法
    const getVirObject = (obj) => {
        let descObj = Object.getOwnPropertyDescriptors(obj);
        let newObj = { _v: {} };
        const vObj = newObj._v;
        Object.keys(descObj).forEach(key => {
            if (key === "constructor") {
                return;
            }
            let valueDesc = descObj[key];
            let value = obj[key];

            if (value instanceof Object) {
                vObj[key] = getVirObject(value);
            } else {
                vObj[key] = {
                    _v: value
                };
            }

            Object.assign(vObj[key], {
                wr: valueDesc['writable'],
                en: valueDesc['enumerable'],
                co: valueDesc['configurable'],
                ge: valueDesc.get ? 1 : undefined,
                se: valueDesc.set ? 1 : undefined
            });
        });

        newObj.cn = obj.constructor.name

        // 递归原型
        let { __proto__ } = obj;
        if (__proto__ !== Object.prototype) {
            newObj.pt = getVirObject(__proto__);
        } else {
            newObj.pt = "";
        }

        return newObj;
    }

    // ----中转console----
    const old_console = window.console;
    const new_console = Object.create(old_console);
    ["log"].forEach(methodName => {
        new_console[methodName] = function (...args) {
            // 修正新对象
            let newArgs = args.map(arg => {
                if (arg instanceof Object) {
                    return getVirObject(arg);
                }
                return arg;
            });

            let stack;
            try {
                getPosition;
            } catch (e) {
                stack = e.stack.toString();
            }

            xdAgent.send({
                type: "console",
                data: {
                    stack,
                    methodName,
                    args: newArgs
                }
            });

            return old_console[methodName](...args);
        }
    });
    window.console = new_console;

})();
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
    let aid = getQueryVariable("__agentId");

    if (!aid) {
        let oldSearch = location.search;
        if (oldSearch) {
            oldSearch = oldSearch.replace(/^\?/, "");
        }
        history.pushState({}, "", `?${oldSearch}&__agentId=a` + Math.random().toString(32).slice(2))
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
            case "runcode":
                let { runcode } = d;
                if (runcode) {
                    let err, retrunValue;
                    try {
                        retrunValue = eval(runcode);
                    } catch (e) {
                        err = e;
                    }

                    xdAgent.send({
                        type: "runnedCode",
                        retrunValue,
                        errInfo: err ? err.toString() : undefined,
                        agentId: aid
                    });
                }
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

            // let value;
            // try {
            //     value = obj[key]
            // } catch (e) {
            //     debugger
            // }

            if (value === document) {
                vObj[key] = {
                    t: "e",
                    _v: "#documnet"
                };
            } else if (value instanceof Element) {
                vObj[key] = {
                    t: "e",
                    _v: value.constructor.name
                };
            } else if (value instanceof Function) {
                let mArr = value.toString().match(/\(.+?\)/);
                vObj[key] = {
                    t: "f",
                    _v: mArr ? mArr[0] : ''
                };
            } else if (value instanceof Object) {
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
        if (__proto__ !== Object.prototype && __proto__ !== Array.prototype) {
            newObj.pt = getVirObject(__proto__);
        } else {
            newObj.pt = "";
        }
        if (obj instanceof Array) {
            newObj.t = "Array";
        }

        // 正则添加断定
        if (obj instanceof RegExp) {
            newObj._v.source = {
                _v: obj.source
            };
        }

        return newObj;
    }

    // ----中转console----
    const old_console = window.console;
    const new_console = Object.create(old_console);
    ["log", "warn", "error"].forEach(methodName => {
        new_console[methodName] = function (...args) {
            // try {
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
            // } catch (e) {
            //     old_console.warn(`
            //     An error occurred, please submit the data here:
            //     https://github.com/kirakiray/XDTool/issues
            //     `, e);
            // }

            return old_console[methodName](...args);
        }
    });
    window.console = new_console;

})();
Component(async (load) => {
    const getType = (data) => Object.prototype.toString.call(data).replace('[object ', "").replace(']', "").toLowerCase();

    const getObjDesc = (obj) => {
        if (getType(obj) == "object") {
            let desc = "{";
            let keys = Object.keys(obj)
            keys.forEach(k => {
                let { _v, en } = obj[k];
                let v = _v;
                switch (getType(_v)) {
                    case "array":
                        v = "[...]";
                        break;
                    case "object":
                        v = "{...}";
                        break;
                    case "string":
                        v = `<span class="color_string">"${v}"</span>`;
                        break;
                    case "number":
                        v = `<span class="color_num">${v}</span>`;
                        break;
                }

                desc += `<span style="color:#565656;">${k}</span>:${v}, `;
            });
            if (keys.length) {
                desc = desc.slice(0, -2);
            }
            desc += "}";
            return desc;
        }
        return obj;
    }

    // 根据对象数据，生成对象元素
    const createObjectEle = (objData, key) => {
        let objType = getType(objData);

        switch (objType) {
            case "object":
            case "array":
                let vData = objData._v;

                let ele = $(`
                <div class="line putaway">
                    <div class="sanjiao_area"></div>
                    <div class="sanjiao"></div>
                    <div class="obj_line">
                        <div class="obj_key">${key}</div>
                        <span class="color_black">:</span>
                        <div class="obj_value"> ${getObjDesc(vData)}</div>
                    </div>
                    <div class="obj_content"></div>
                </div>
                `);

                if (!(vData instanceof Object)) {
                    ele.que(".sanjiao_area").remove();
                }

                if (!objData.en) {
                    ele.que(".obj_key").class.add("pri_key");
                }

                if (key !== "__proto__") {
                    let key_infos = $(`<div class="key_infos"></div>`);
                    if ("wr" in objData) {
                        key_infos.push(`<div class="key_info_line">writable:<span class="color_num">${objData.wr}</span></div>`);
                    }
                    if ("en" in objData) {
                        key_infos.push(`<div class="key_info_line">enumerable:<span class="color_num">${objData.en}</span></div>`);
                    }
                    if ("co" in objData) {
                        key_infos.push(`<div class="key_info_line">configurable:<span class="color_num">${objData.co}</span></div>`);
                    }
                    if (objData.ge) {
                        key_infos.push(`<div class="key_info_line">get:(...)</div>`);
                    }
                    if (objData.se) {
                        key_infos.push(`<div class="key_info_line">set:(...)</div>`);
                    }
                    // 添加特性hover小窗口
                    ele.que(".obj_key").push(key_infos);
                }

                if (key === undefined) {
                    ele.que(".obj_line").unshift(`<div class="class_name">${objData.cn}</div>`);
                    ele.que(".color_black").remove();
                    ele.que(".obj_key").remove();
                }

                switch (getType(vData)) {
                    case "object":
                        Object.keys(vData).forEach(k => {
                            let childObjData = vData[k];
                            if (!childObjData._v) {
                                return;
                            }

                            let childEle = createObjectEle(childObjData, k);

                            ele.que(".obj_content").push(childEle);
                        });

                        let proto = objData.pt;

                        if (proto) {
                            proto.en = false;
                            let protoLine = createObjectEle(proto, "__proto__");
                            protoLine.que(".obj_value").html = proto.cn;
                            protoLine.que(".obj_value").class.add("still");
                            ele.que(".obj_content").push(protoLine);
                        } else if (proto == "") {
                            ele.que(".obj_content").push(`
                                <div class="line">
                                    <div class="obj_line">
                                        <div class="obj_key pri_key">__proto__</div>
                                        <span class="color_black">:</span>
                                        <div class="obj_value still">Object</div>
                                    </div>
                                </div>
                                `);
                        }
                        break;
                    case "string":
                        ele.que(".obj_value").html = `<span class="color_black">"</span><span class="color_string">${vData}</span><span class="color_black">"</span>`;
                        ele.que(".sanjiao").class.add("hide");
                        break;
                    case "number":
                        ele.que(".obj_value").html = `<span class="color_num">${vData}</span>`;
                        ele.que(".sanjiao").class.add("hide");
                        break;
                    default:
                        debugger
                }

                return ele;
            case "number":
                return $(`
                    <div class="line2">
                        <span class="color_num">${objData}</span>
                    </div>`);
            case "string":
                return $(`
                    <div class="line2">
                        <span class="color_string">${objData}</span>
                    </div>`);
            case "null":
                return $(`
                <div class="line2">
                    <span class="color_gray">null</span>
                </div>`);
        }
    }

    return {
        tag: "console-block",
        temp: true,
        css: true,
        data: {
            // 是否命令行输入
            isCommand: false,
            methodName: "",
            args: "",
            // args: `[{"_v":{"a":{"_v":"I am a","wr":true,"en":true,"co":true},"a_obj":{"_v":{"val":{"_v":"I am a_obj","wr":true,"en":true,"co":true}},"cn":"Object","pt":"","wr":true,"en":true,"co":true},"a2":{"_v":1111111,"wr":true,"en":true,"co":true},"a_pri2":{"_v":"a_pri222222222222","wr":false,"en":false,"co":false}},"cn":"A2","pt":{"_v":{"a2_pri":{"_v":"a2_priiiiiiii","en":false,"co":true,"ge":1}},"cn":"A2","pt":{"_v":{"a_pri":{"_v":"aaaaaaaaa_pri","en":false,"co":true,"ge":1},"a_seter":{"en":false,"co":true,"se":1}},"cn":"A","pt":""}}}]`,
            stack: "",
            // 定位
            posi: "",
            posiStr: "",
            _unpush: ["posi", "posiStr"]
        },
        watch: {
            args(e, args) {
                if (!args) {
                    return;
                }
                args = JSON.parse(args);
                this._args = args;

                args.forEach(e => {
                    let objEle = createObjectEle(e);

                    objEle && this.$container.push(objEle);
                });

                this.$container.on("click", ".sanjiao_area", e => {
                    e.delegateTarget.parent.class.toggle("putaway");
                });
            },
            stack(e, stack) {
                if (!stack) {
                    return;
                }
                // 通用模式
                let arr = stack.match(/http.+/g);
                this.posi = arr.slice(-1)[0];
            },
            posi(e, posi) {
                if (!posi) {
                    return;
                }
                let posStr = posi.match(/.+\/(.+)/)[1];

                // 参数屏蔽
                if (/\?/.test(posStr)) {
                    posStr = posStr.replace(/\?.+(:\d*:\d*)$/, (...args) => {
                        return "?..." + args[1];
                    })
                }

                this.posiStr = posStr;
            }
        }
    };
});
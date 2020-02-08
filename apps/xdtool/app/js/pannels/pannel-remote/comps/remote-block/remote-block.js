Component(async (load) => {
    return {
        tag: "remote-block",
        temp: true,
        link: true,
        data: {
            name: "(empty))",
            href: "",
            ua: "",
            sys: "",
            sysVer: "",
            bro: "",
            broVer: "",
            agentId: "",
            _update: false
        },
        watch: {
            href(e, href) {
                this.name = href.replace(/\?.+/, "").replace(/.+\//, "")
            },
            async ua(e, ua) {
                // 系统平台
                let system = "";
                let systemVer = "";

                // 浏览器平台
                let browser = "";
                let browserVer = "";

                try {
                    // 查找套壳浏览器
                    // if (ua.indexOf("MQQBrowser") > -1) {
                    //     // 手机qq内置浏览器
                    //     browser = "MQQBrowser";
                    //     browserVer = ua.match(/MQQBrowser\/(\S*)/)[1];
                    // } if (ua.indexOf("QQBrowser") > -1) {
                    //     // PC QQ浏览器
                    //     browser = "QQBrowser";
                    //     browserVer = ua.match(/QQBrowser\/(\S*)/)[1];
                    // } else 

                    if (ua.indexOf("Chrome") > -1) {
                        browser = "Chrome";
                        browserVer = ua.match(/Chrome\/(\S*)/)[1];
                    } else if (ua.indexOf("Safari") > -1) {
                        browser = "Safari";
                        browserVer = ua.match(/Safari\/(\S*)/)[1];
                    } else if (ua.indexOf("Firefox") > -1) {
                        browser = "Firefox";
                        browserVer = ua.match(/Firefox\/(\S*)/)[1];
                    }

                    if (ua.indexOf("Windows") > -1) {
                        system = "Windows";
                        systemVer = ua.match(/Windows NT (\S*);/)[1];
                    } else if (ua.indexOf("Android") > -1) {
                        system = "Android";
                        systemVer = ua.match(/Android (\d*)/)[1];
                    } else if (ua.indexOf("iPhone OS") > -1) {
                        system = "iOS";
                        systemVer = ua.match(/iPhone OS (\S*)/)[1].replace(/_/g, ".");
                    } else if (ua.indexOf("Mac OS X") > -1) {
                        system = "Mac OS X";
                        systemVer = ua.match(/Mac OS X (.*?)[\);]/)[1].replace(/_/g, ".");
                    }
                } catch (e) {
                    debugger
                }

                if (!system) {
                    system = "不明";
                }

                if (!browser) {
                    browser = "不明";
                }

                Object.assign(this, {
                    sys: system,
                    sysVer: systemVer,
                    bro: browser,
                    broVer: browserVer
                });

                // 根据信息添加icon
                if (ua.indexOf("MI") > -1) {
                    this.queShadow(".remote_block_avatar").push(`
                        <div class="avatar_block" style="background-image:url(${await load('./img/xiaomi.svg -getPath')})"></div>
                    `);
                }

                let systemIcon = "";
                switch (system) {
                    case "Windows":
                        systemIcon = await load('./img/windows.svg -getPath')
                        break;
                    case "Android":
                        systemIcon = await load('./img/android.svg -getPath')
                        break;
                    case "iOS":
                        systemIcon = await load('./img/apple.svg -getPath')
                        break;
                    case "Mac OS X":
                        systemIcon = await load('./img/Mac.svg -getPath')
                        break;
                }
                systemIcon && this.queShadow(".remote_block_avatar").push(`
                    <div class="avatar_block" style="background-image:url(${systemIcon})"></div>
                `);

                // 优先添加外壳浏览器icon
                if (ua.indexOf("QQBrowser") > -1) {
                    this.queShadow(".remote_block_avatar").push(`
                        <div class="avatar_block" style="background-image:url(${await load('./img/QQBrowser.svg -getPath')})"></div>
                    `);
                } else if (ua.indexOf("MicroMessenger") > -1) {
                    this.queShadow(".remote_block_avatar").push(`
                        <div class="avatar_block" style="background-image:url(${await load('./img/wechat.svg -getPath')})"></div>
                    `);
                } else if (ua.indexOf("Quark") > -1) {
                    this.queShadow(".remote_block_avatar").push(`
                        <div class="avatar_block" style="background-image:url(${await load('./img/quark.svg -getPath')})"></div>
                    `);
                } else if (ua.indexOf("UCBrowser") > -1) {
                    this.queShadow(".remote_block_avatar").push(`
                        <div class="avatar_block" style="background-image:url(${await load('./img/UCBrowser.svg -getPath')})"></div>
                    `);
                }

                let browserIcon = "";
                switch (browser) {
                    case "Chrome":
                        browserIcon = await load('./img/Chrome.svg -getPath')
                        break;
                    case "Safari":
                        browserIcon = await load('./img/safari.svg -getPath')
                        break;
                    case "Firefox":
                        browserIcon = await load('./img/firefox.svg -getPath')
                        break;
                }
                browserIcon && this.queShadow(".remote_block_avatar").push(`
                    <div class="avatar_block" style="background-image:url(${browserIcon})"></div>
                `);
            }
        }
    };
});
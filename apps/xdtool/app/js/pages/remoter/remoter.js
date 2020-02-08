define(async (load) => {
    let stData = await load("data/stData");

    await load("pannels/pannel-console -pack");

    return {
        temp: true,
        link: true,
        data: {
            ua: "ua",
            // 地址
            href: "",
            // 系统
            sys: "",
            sysVer: "",
            // 浏览器配置
            bro: "",
            broVer: ""
        },
        watch: {},
        proto: {},
        ready(opts) {
            let { data } = opts;

            Object.assign(this, {
                ua: data.ua,
                href: data.href,
                sys: data.sys,
                sysVer: data.sysVer,
                bro: data.bro,
                broVer: data.broVer
            });

            let timer;
            stData.remoterConsoles.watch((e, remoterConsoles) => {
                if (timer) { return; }
                timer = 1;
                setTimeout(() => {
                    // 获取目标consoles数据
                    let consolesData = remoterConsoles[data.agentId];

                    if (!consolesData) {
                        // 窗口关闭
                        this.$closeTips.display = "";
                        return;
                    }

                    if (consolesData === this._oldConsoleData) {
                        timer = false;
                        return;
                    }

                    if (consolesData) {
                        consolesData.sync(this.$pannelConsole, null, true);
                    }

                    // 挂在旧数据
                    this._oldConsoleData = consolesData;

                    timer = false;
                }, 100);
            }, true);
        },
        destory() {
            if (this._oldConsoleData) {
                this._oldConsoleData.unsync(this.$pannelConsole);
                this._oldConsoleData = null;
            }
        }
    };
});
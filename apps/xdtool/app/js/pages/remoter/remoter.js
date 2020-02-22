define(async (load) => {
    let stData = await load("data/stData");

    await load("pannels/pannel-console -pack", "comps/slide-frame -pack");

    return {
        temp: true,
        css: true,
        data: {
            ua: "ua",
            // 地址
            href: "",
            // 系统
            sys: "",
            sysVer: "",
            // 浏览器配置
            bro: "",
            broVer: "",
            agentId: ""
        },
        watch: {},
        proto: {},
        ready(opts) {
            let { data } = opts;

            this.agentId = data.agentId;

            Object.assign(this, {
                ua: data.ua,
                href: data.href,
                sys: data.sys,
                sysVer: data.sysVer,
                bro: data.bro,
                broVer: data.broVer
            });

            let timer;
            stData.remoterConsoles.watch(this._oldWatch = (e, remoterConsoles) => {
                if (timer) { return; }
                timer = 1;
                setTimeout(() => {
                    // 获取目标consoles数据
                    let consolesData = remoterConsoles[data.agentId];

                    if (!consolesData) {
                        // 窗口关闭
                        this.$closeTips.display = "";
                        timer = false;
                        return;
                    }

                    if (consolesData === this._oldConsoleData) {
                        timer = false;
                        return;
                    }

                    if (this._oldConsoleData) {
                        this._oldConsoleData.unsync(this.$pannelConsole);
                        this._oldConsoleData = null;
                        this.$pannelConsole.empty();
                    }

                    if (consolesData) {
                        consolesData.sync(this.$pannelConsole, null, true);
                    }

                    // 挂在旧数据
                    this._oldConsoleData = consolesData;
                    this.$closeTips.display = "none";
                    timer = false;
                }, 300);
            }, true);
        },
        destory() {
            if (this._oldConsoleData) {
                this._oldConsoleData.unsync(this.$pannelConsole);
                this._oldConsoleData = null;
            }

            if (this._oldWatch) {
                stData.remoterConsoles.unwatch(this._oldWatch);
            }
        }
    };
});
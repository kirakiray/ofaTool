Component(async (load) => {
    return {
        tag: "file-block",
        temp: true,
        link: true,
        attrs: ["name", "isDir"],
        data: {
            // 文件名
            name: "(empty)",
            // 是否文件夹
            isDir: false,
            // 目录是否打开
            diropen: false,
            // 文件后缀名
            extname: "",
            // 是否隐藏
            hideblock: false,
            // 不同步的字段
            _unpush: ["isDir", "extname", "hideblock"],
        },
        watch: {
            hideblock(e, val) {
                if (val) {
                    this.display = "none";
                } else {
                    this.display = "";
                }
            },
            name(e, val) {
                // 获取文件后缀
                let extname = /.+\.(.+)/.exec(val);
                if (extname) {
                    this.extname = extname[1];
                }
            }
        },
        proto: {
            // 打开或关闭文件夹
            async toggleDir() {
                let diropen = this.diropen = !this.diropen;

                if (diropen) {
                    this.emit("toggleDir", {
                        path: this.getPath()
                    });
                }
            },
            // 获取相应目录地址
            getPath() {
                let arr = this.parents("file-block");
                arr.unshift(this);
                arr.reverse();

                return arr.map(e => e.name).join("/");
            }
        },
        ready() { }
    };
});
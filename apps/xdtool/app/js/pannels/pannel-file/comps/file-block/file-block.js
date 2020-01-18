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
            // 不同步的字段
            _unsync: ["isDir", "extname"],
        },
        watch: {
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
            toggleDir() {
                let diropen = this.diropen = !this.diropen;
                // if (diropen) {
                //     this.$childs.display = "";
                // } else {
                //     this.$childs.display = "none";
                // }
            }
        },
        ready() { }
    };
});
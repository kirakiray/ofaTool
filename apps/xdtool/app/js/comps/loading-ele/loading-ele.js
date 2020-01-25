Component({
    tag: "loading-ele",
    temp: true,
    attrs: ["size", "hide"],
    data: {
        // 圆圈大小
        size: 38,
        // 是否隐藏
        hide: false
    },
    watch: {
        size(e, val) {
            this.$loadingCon.style.width = `${val}px`;
            this.$loadingCon.style.height = `${val}px`;
        }
    }
});
Component({
    tag: "slide-frame",
    temp: true,
    hostcss: "./slide-frame-host.css",
    proto: {
        // 更新左边图标
        refreshLeftBtns() {

        }
    },
    data: {
        // 激活中的id
        active: 0
    },
    attrs: ["active"],
    watch: {
        active(e, id) {
            let targetBtn = this.que(`[slide-frame-btn="${id}"]`);
            let targetPage = this.que(`[slide-frame-page="${id}"]`);

            // 关掉旧的
            let oldBtn = this.que('.btn_active');
            let oldPage = this.que(".page_active");

            if (!targetBtn || targetBtn == oldBtn) {
                return;
            }

            oldBtn && oldBtn.class.remove("btn_active");
            oldPage && oldPage.class.remove("page_active");

            targetBtn.class.add("btn_active");
            targetPage.class.add("page_active");
        }
    },
    ready() {
        this.refreshLeftBtns();

        // 点击了左侧按钮
        this.on("click", "[slide-frame-btn]", e => {
            let id = e.delegateTarget.attrs["slide-frame-btn"];

            // 设置本地id
            this.active = id;
        });
    }
});
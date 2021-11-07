// 左侧拖动宽度
(() => {
    const getWidth = (width, maxWidth) => {
        if (width < 200) {
            width = 200
        } else if (width > maxWidth) {
            width = maxWidth;
        }
        return width;
    }

    task(async (load, { _this }) => {
        // 左边改变宽度的方法
        let oWidth;
        const xtLeft = _this.$shadow.$(".xt_left");
        let startX = 0, startWidth = 0, maxWidth = window.innerWidth * 0.6, width = 260;
        const mouseMove = (e) => {
            let event = e.originalEvent;
            let diffX = event.pageX - startX;
            width = startWidth + diffX;

            width = getWidth(width, maxWidth);

            xtLeft.style.width = width + "px";
        }

        const mouseUp = (e) => {
            $("body").off("mousemove", mouseMove);
            $("body").off("mouseup", mouseUp);
        }

        _this.$shadow.$(".left_sizer").on("mousedown", e => {
            let event = e.originalEvent;
            startX = event.pageX;
            startWidth = xtLeft.width;
            maxWidth = window.innerWidth * 0.6;

            // 在body上绑定
            $("body").on("mousemove", mouseMove);
            $("body").on("mouseup", mouseUp);
        })

        // 设置初始值
        if (oWidth) {
            xtLeft.style.width = getWidth(oWidth, maxWidth) + "px";
        }
    });
})();
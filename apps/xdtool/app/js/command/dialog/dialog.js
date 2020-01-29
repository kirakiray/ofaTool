define(async (load) => {
    await load("./dialog.css");

    // 修正dialog_outer
    function fixOuter() {
        let outer = $(".dialog_outer");

        if (!outer) {
            $("body").push(`<div class="dialog_outer"></div>`);
        }
    }

    // 隐藏并删除元素
    function removeEle(ele) {
        // 获取高度
        let height = ele.height;

        ele.style.height = height + "px";
        ele.style.opacity = "1";
        ele.style.transition = "all ease .2s";
        setTimeout(() => {
            ele.style.height = 0;
            ele.style.opacity = 0;
            setTimeout(() => {
                ele.remove();
            }, 200);
        }, 50);

    }

    return (opts) => {
        let defaults = {
            type: "toast",
            text: "",
            duration: 2000
        };
        if (typeof opts == "object") {
            Object.assign(defaults, opts);
        } else {
            defaults.text = opts;
        }

        fixOuter();

        // 根据类型生成弹窗
        switch (defaults.type) {
            case "toast":
                let ele = $(`
                <div class="toast_con">
                    <div class="toast_text">${defaults.text}</div>
                    <div class="toast_close_btn">×</div>
                </div>
                `);

                let t = setTimeout(() => {
                    removeEle(ele);
                }, defaults.duration);

                ele.que(".toast_close_btn").on('click', e => {
                    clearTimeout(t);
                    removeEle(ele)
                });


                $(".dialog_outer").push(ele);
                break;
        }
    }
});
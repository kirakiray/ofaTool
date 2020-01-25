define(async (load) => {
    // 加载样式ƒ
    await load("./right-menu.css");

    // 生成menuList元素


    return function (menus, opts = {
        clientX: 300,
        clientY: 300
    }) {
        // 删掉之前的
        $.queAll(".menu_con").forEach(e => e.remove());

        // body点击干掉
        $("body").on("click", e => {
            $.queAll(".menu_con").forEach(e => e.remove());
        });

        // 禁止默认行为
        opts.preventDefault && opts.preventDefault();

        // 菜单元素
        let menuList = $(`
        <div class="menu_con" id="menu_con" style="position:absolute;">
            <div class="menu_list"></div>
        </div>
        `);

        Object.assign(menuList.style, {
            top: `${opts.clientY}px`,
            left: `${opts.clientX}px`,
        });

        // 菜单生成
        let groupEle = $(`<div class="group"></div>`);
        menus.forEach(e => {
            // 分割器分组
            if (e.type == "separator") {
                menuList.que(".menu_list").push(groupEle);
                groupEle = $(`<div class="group"></div>`);
                return;
            }

            let menuBlock = $(`
            <div class="menu_block">
                <div class="menu_block_name">${e.label}</div>
            </div>
            `);

            if (e.submenu) {
                menuBlock.class.add("san_jiao");
            }

            // 点击断定
            e.click && menuBlock.on("click", e.click);

            groupEle.push(menuBlock);
        });

        // 添加最后一组
        menuList.que(".menu_list").push(groupEle);

        $("body").push(menuList);
    }
});
define(async (load) => {
    // 加载样式ƒ
    await load("./right-menu.css");

    // 生成menuList元素
    const createMenuList = (menus) => {
        // 菜单元素
        let menuList = $(`
        <div class="menu_con">
            <div class="menu_list"></div>
        </div>
        `);

        // 菜单生成
        let groupEle = $(`<div class="group"></div>`);
        menus.forEach(e => {
            // 分割器分组
            if (e.type == "separator") {
                menuList.$(".menu_list").push(groupEle);
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

                // 移动到上面展示二级菜单
                let subMenuList = createMenuList(e.submenu);

                menuBlock.push(subMenuList);
            }

            // 点击断定
            e.click && menuBlock.on("mouseup", e.click);

            groupEle.push(menuBlock);
        });

        // 添加最后一组
        menuList.$(".menu_list").push(groupEle);

        return menuList;
    }

    return function (menus, opts = {
        clientX: 300,
        clientY: 300
    }) {
        // 删掉之前的
        $.all(".menu_con").forEach(e => e.remove());

        // body点击干掉
        $("body").on("click", e => {
            $.all(".menu_con").forEach(e => e.remove());
        });

        // 禁止默认行为
        opts.preventDefault && opts.preventDefault();

        // 根据当前鼠标位置，修正方向
        let s_height = window.innerHeight;
        let s_width = window.innerWidth;

        // 是否从左弹出
        let to_left = false;
        // 是否从上弹出
        let to_top = false;

        if (opts.clientX > s_width / 3 * 2) {
            to_left = true;
        }
        if (opts.clientY > s_height / 3 * 2) {
            to_top = true;
        }

        let menuList = createMenuList(menus);

        let styleObj = {
            position: "fixed"
        };

        if (to_left) {
            styleObj.right = s_width - opts.clientX - 15 + "px";
            menuList.class.add("to_left");
        } else {
            styleObj.left = opts.clientX + "px";
        }

        if (to_top) {
            styleObj.bottom = s_height - opts.clientY + "px";
            menuList.class.add("to_top");
        } else {
            styleObj.top = opts.clientY + "px";
        }

        Object.assign(menuList.style, styleObj);

        $("body").push(menuList);
    }
});
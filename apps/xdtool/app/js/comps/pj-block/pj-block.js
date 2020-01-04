Component({
    tag: "pj-block",
    temp: true,
    link: true,
    data: {
        // 是否激活状态
        active: 0,
        // 项目名称
        name: "(empty)",
        // 下面的时间
        tips: "",
        // 项目数据
        project: ""
    },
    attrs: ["active"]
});
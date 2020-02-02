Component(async (load) => {


    return {
        tag: "remote-block",
        temp: true,
        link: true,
        data: {
            name: "(empty))",
            href: "",
            _update: false
        },
        watch: {
            href(e, href) {
                this.name = href.replace(/\?.+/, "").replace(/.+\//, "")
            }
        }
    };
});
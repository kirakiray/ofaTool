(() => {
    let shell;

    try {
        shell = require('electron').shell;
    } catch (e) {
    }

    Component({
        tag: "ele-link",
        attrs: ["href"],
        temp: `
            <style>:host{display:contents;cursor:pointer;text-decoration: underline;}</style>
            <slot></slot>
        `,
        ready() {
            this.on("click", e => {
                if (shell) {
                    shell.openExternal(this.href);
                } else {
                    window.open(this.href);
                }
            });
        }
    });
})();
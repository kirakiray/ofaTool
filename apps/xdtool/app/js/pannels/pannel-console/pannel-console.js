Component(async (load) => {
    await load("./comps/console-block -pack");

    return {
        tag: "pannel-console",
        temp: true,
        link: true,
        ready() {
            
        }
    };
});
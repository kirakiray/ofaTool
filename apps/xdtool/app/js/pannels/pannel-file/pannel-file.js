Component(async (load) => {
    await load("./comps/file-block -pack");

    return {
        tag: "pannel-file",
        temp: true,
        link: true
    };
});
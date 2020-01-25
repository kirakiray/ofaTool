// URL上的参数
task(async () => {
    let arr = location.search.replace("?", "").split("&");
    let data = {};
    arr && arr.forEach(str => {
        let [key, value] = str.split("=");
        data[key] = value;
    });

    return data;
});
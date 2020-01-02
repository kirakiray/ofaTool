define(() => {

    return {
        // 获取项目用显示时间
        getRecentDesc(time) {
            let date = new Date(time);

            let str = `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

            return str;
        }
    };
});
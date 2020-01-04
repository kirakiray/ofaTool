define(() => {
    return {
        // 获取项目用显示时间
        getRecentDesc(time) {
            let date = new Date(time);

            // 获取时间差
            let diffTime = new Date().getTime() - time;

            // 转化为秒
            let secondTime = diffTime / 1000;

            let str = "";

            // 修正事件语言
            if (secondTime < 60) {
                str = "刚刚";
            } else if (secondTime < 3600) {
                str = Math.floor(secondTime / 60) + "分钟前";
            } else if (secondTime < 86400) {
                str = Math.floor(secondTime / 3600) + "小时前";
            } else {
                str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
            }

            return str;
        }
    };
});
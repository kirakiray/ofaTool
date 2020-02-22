//path模块
var path = require('path');  /*nodejs自带的模块*/
const { getRandowStr, getIPAddress } = require("../common");

// 代理模式添加制定标签
const addRemoter = (ctx) => {
    var extname = path.extname(ctx.pathname);	 //获取文件的后缀名

    if (extname === ".html" && ctx.params.__addremote == 1) {
        let bodyHTML = ctx.body.toString();
        let ip = getIPAddress();
        bodyHTML += `
        <script src="http://${ip}:9876/xdtool/remoter/StanzClientAgent.js"></script>
        <script src="http://${ip}:9876/xdtool/remoter/xdtool_remoter.js"></script>`;
        ctx.body = bodyHTML;
    }
}

module.exports = addRemoter;
const authorize = ( openid,activity_id, from, store_code) => {
    const afterUrl = window.location.href.split('?')[0];
    var xjj_openId = urlGet()['xjj_openId'];
    const _url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&" +
        "redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state=" +
        afterUrl + "QwechatQ30000019QwechatQactivity_id=" + activity_id + "QwechatQopenid=" + openid +
        "QwechatQfrom=" + from + "QwechatQstore_code=" + store_code + "#wechat_redirect";
    //测试地址
    //  window.location.href = afterUrl + '?activity_id=7&openid=oToLbjpFU7xvCUZJJdqbE2unoJNA&store_code=123123123&form=1&xjj_openId=oOduRwhzRRpoctl9kTE3SOOrfhOo';
    //正式地址
    if (typeof(xjj_openId) == "undefined") {
        window.location.href = _url;
    };
    // 这个返回的url地址中会有一个【subscribe】字段如果subscribe值是1表示关注了这个公众号 如果是0表示没有关注
    // 截取链接地址字符js
    function urlGet() {
        var aQuery = window.location.href.split("?"); //取得Get参数
        var aGET = new Array();
        if (aQuery.length > 1) {
            var aBuf = aQuery[1].split("&");
            for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
                var aTmp = aBuf[i].split("="); //分离key与Value
                aGET[aTmp[0]] = decodeURIComponent(aTmp[1]);
            }
        }
        return aGET;
    };
};
export { authorize };
// this_url  [这个是页面地址栏的链接地址]
// activity_id【这个是地址栏的截取的字段（activity_id）的值】
// openid【这个是地址栏的截取的字段（openid）的值】
// from【这个是地址栏的截取的字段（from）的值】
// store_code【这个是地址栏的截取的字段（store_code）的值】

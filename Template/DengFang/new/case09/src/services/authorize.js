const authorize = (activity_id, openid, from, store_code, friendOpenId) => {
  let afterUrl = window.location.origin + '/#/';
  var xjj_openId = urlGet()['xjj_openId'];
  // if (friendOpenId) {
  //   // 带着friendOpenId信息的授权
  //   const share_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&" +
  //     "redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state=" +
  //     afterUrl + "QwechatQ30000019QwechatQactivity_id=" + activity_id + "QwechatQopenid=" + openid +
  //     "QwechatQdefaultFrom=" + from + "QwechatQstore_code=" + store_code + "QwechatQfriendOpenId=" + friendOpenId + "#wechat_redirect";
  //   // 如果是分享来的链接
  //   if (!openid) {
  //     const url = window.location.origin + '/#/' + window.location.search;
  //     // 这个授权可以拿到当前人的openid
  //     window.location.href = "http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=" + encodeURIComponent(url);
  //   } else {
  //     if (typeof(xjj_openId) == "undefined") {
  //       window.location.href = share_url;
  //     }
  //   }
  // } else {
  //   // 正常的xjj_openId授权
  //   const normal_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&" +
  //     "redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state=" +
  //     afterUrl + "QwechatQ30000019QwechatQactivity_id=" + activity_id + "QwechatQopenid=" + openid +
  //     "QwechatQdefaultFrom=" + from + "QwechatQstore_code=" + store_code + "#wechat_redirect";
  //   // 用户正常参与的链接链接地址就会有openid
  //   if (typeof(xjj_openId) == "undefined") {
  //     window.location.href = normal_url;
  //   }
  // }
  window.location.href = afterUrl + '?activity_id=7&openid=oToLbjpFU7xvCUZJJdqbE2unoJNA&store_code=123123123&form=1&xjj_openId=oOduRwhzRRpoctl9kTE3SOOrfhOo';
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
export {authorize};
// this_url  [这个是页面地址栏的链接地址]
// activity_id【这个是地址栏的截取的字段（activity_id）的值】
// openid【这个是地址栏的截取的字段（openid）的值】
// from【这个是地址栏的截取的字段（from）的值】
// store_code【这个是地址栏的截取的字段（store_code）的值】

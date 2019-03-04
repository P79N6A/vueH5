const authorize = (activity_id, oldOpenid, from, store_code, friendOpenId, shareId) => {
  let afterUrl = window.location.href.split('?')[0] + '/#/';
  let xjj_openId = urlGet('xjj_openId');
  let openid = urlGet('openid');
  // 获取openid
  console.log(window.location.search)
  if (typeof openid === "undefined") {
    const url = window.location.origin + '/#/?' + window.location.href.split('?')[1];
    // 这个授权可以拿到当前人的openid
    // window.location.href = "http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=" + encodeURIComponent(url);
  }
  debugger;

  if (friendOpenId) {
    // 带着friendOpenId信息的授权
    const share_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&" +
      "redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state=" +
      afterUrl + "QwechatQ30000019QwechatQactivity_id=" + activity_id + "QwechatQopenid=" + openid +
      "QwechatQdefaultFrom=" + from + "QwechatQstore_code=" + store_code + "QwechatQfriendOpenId=" + friendOpenId +
      "QwechatQshareId=" + shareId + "#wechat_redirect";
    // 如果是分享来的链接
    if (typeof xjj_openId === "undefined") {
      window.location.href = share_url;
    }
  } else {
    // 正常的xjj_openId授权
    const normal_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&" +
      "redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state=" +
      afterUrl + "QwechatQ30000019QwechatQactivity_id=" + activity_id + "QwechatQopenid=" + openid +
      "QwechatQdefaultFrom=" + from + "QwechatQstore_code=" + store_code + "#wechat_redirect";
    // 用户正常参与的链接链接地址就会有openid
    if (typeof xjj_openId === "undefined") {
      window.location.href = normal_url;
    }
  }
  // 这个返回的url地址中会有一个【subscribe】字段如果subscribe值是1表示关注了这个公众号 如果是0表示没有关注
  function urlGet(val) {
    const aQuery = window.location.href.split("?"); //取得Get参数
    let aGET = [];
    if (aQuery.length > 1) {
      const aBuf = aQuery[1].split("&");
      for (let i = 0, iLoop = aBuf.length; i < iLoop; i++) {
        const aTmp = aBuf[i].split("="); //分离key与Value
        aGET[aTmp[0]] = decodeURIComponent(aTmp[1]);
      }
    }
    return aGET[val];
  }
};
export {authorize};
// this_url  [这个是页面地址栏的链接地址]
// activity_id【这个是地址栏的截取的字段（activity_id）的值】
// openid【这个是地址栏的截取的字段（openid）的值】
// from【这个是地址栏的截取的字段（from）的值】
// store_code【这个是地址栏的截取的字段（store_code）的值】

const authorize = (url, activity_id, store_code, friendOpenId, shareId) => {
  let afterUrl = url.split('?')[0];
  let xjj_openId = urlGet(url, 'xjj_openId');
  let openid = urlGet(url, 'openid');
  // 获取openid 打开分享链接都需获取openid
  if (typeof openid == "undefined") {
    // 这个授权可以拿到当前人的
    window.location.href = "http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=" + encodeURIComponent(url);
  } else if (friendOpenId) {
    // 带着friendOpenId信息的授权
    const share_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&" +
      "redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state=" +
      afterUrl + "QwechatQ30000019QwechatQactivity_id=" + activity_id + "QwechatQopenid=" + openid +
      "QwechatQstore_code=" + store_code + "QwechatQfriendOpenId=" + friendOpenId +
      "QwechatQitemId=" + shareId + "#wechat_redirect";
    // 如果是分享来的链接
    if (typeof xjj_openId === "undefined") {
      window.location.href = share_url;
    }
  } else {
    // 正常的xjj_openId授权
    const normal_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&" +
      "redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state=" +
      afterUrl + "QwechatQ30000019QwechatQactivity_id=" + activity_id + "QwechatQopenid=" + openid +
      "QwechatQstore_code=" + store_code + "#wechat_redirect";
    // 用户正常参与的链接链接地址就会有openid
    if (typeof xjj_openId === "undefined") {
      window.location.href = normal_url;
    }
  }
  // 这个返回的url地址中会有一个【subscribe】字段如果subscribe值是1表示关注了这个公众号 如果是0表示没有关注
  function urlGet(url, val) {
    const aQuery = url.split("?"); //取得Get参数
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

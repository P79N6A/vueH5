const authorize = (activity_id, openid, from, store_code) => {
  const afterUrl = window.location.href.split('?')[0];
  // const _url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&" +
  //   "redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state=" +
  //   afterUrl + "QwechatQ30000019QwechatQactivity_id=" + activity_id + "QwechatQopenid=" + openid +
  //   "QwechatQfrom=" + from + "QwechatQstore_code=" + store_code + "#wechat_redirect";
  //测试地址
  window.location.href = afterUrl + '?activity_id=1242&openid=oToLbjpFU7xvCUZJJdqbE2unoJNA&store_code=123123123&form=1&xjj_openId=oOduRwhzRRpoctl9kTE3SOOrfhOo';
  //正式地址
  //window.location.href = _url;

  // 这个返回的url地址中会有一个【subscribe】字段如果subscribe值是1表示关注了这个公众号 如果是0表示没有关注
};
export  {authorize};
// this_url  [这个是页面地址栏的链接地址]
// activity_id【这个是地址栏的截取的字段（activity_id）的值】
// openid【这个是地址栏的截取的字段（openid）的值】
// from【这个是地址栏的截取的字段（from）的值】
// store_code【这个是地址栏的截取的字段（store_code）的值】

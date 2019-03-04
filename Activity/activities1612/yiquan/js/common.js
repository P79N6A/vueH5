
/**
 * acmp.aikaka.com.cn环境配置
 */
// var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/';
// var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBag/';
// var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/base?callback_url=';

var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/';
var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBag/';
var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/base?callback_url=';
var activity_item_id_1="613";
var activity_item_id_2="614";
function urlGet() {
    var aQuery = window.location.href.split("?"); //取得Get参数
    var aGET = new Array();
    if (aQuery.length > 1) {
        var aBuf = aQuery[1].split("&");
        for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
            var aTmp = aBuf[i].split("="); //分离key与Value
            aGET[aTmp[0]] = aTmp[1];
        }
    }
    return aGET;
}

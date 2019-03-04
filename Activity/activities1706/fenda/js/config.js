var this_url = window.location.href;
if ($.trim(this_url).substr(0, 21) == "http://acmp.aikaka.cc") {
    // 测试地址
    var acmp_host = 'http://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cc/cocacola/CouponBagV2/';
    var first_item = "lottery-3547";
    var ques_activity_id = "1096";
    var ques_activity_item_id = "1425";
} else if ($.trim(this_url).substr(0, 25) == "http://acmp.aikaka.com.cn") {
    // 正式地址
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
    var first_item = "lottery-3547";
    var ques_activity_id = "1096";
    var ques_activity_item_id = "1425";
}
var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=';
var info_url_get = acmp_host + "share/record"; //分享统计接口
var info_ajax_url = acmp_host + "share/click"; //点击分享链接的接口

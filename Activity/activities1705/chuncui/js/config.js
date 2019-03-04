var this_url = window.location.href;

if ($.trim(this_url).substr(0, 9) == "http://ab") {
    // 测试地址
    var acmp_host = 'http://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    var coupon_bag_host = 'http://ab.aikaka.com.cn/AcmpCola/CouponBagV2/';
    var info_url_get = acmp_host + "share/record"; //分享统计接口
    var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=';
    var info_ajax_url = acmp_host + "share/click"; //点击分享链接的接口
    var first_item = "lottery-3264";
    
} else if ($.trim(this_url).substr(0, 11) == "http://acmp") {
    // 正式地址
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
    var info_url_get = acmp_host + "share/record"; //分享统计接口
    var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=';
    var info_ajax_url = acmp_host + "share/click"; //点击分享链接的接口
    var first_item = "lottery-3264";
}

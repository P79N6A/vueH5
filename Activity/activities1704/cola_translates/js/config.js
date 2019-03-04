var this_url = window.location.href;
if ($.trim(this_url).substr(0, 9) == "http://ab") {
    var acmp_host = 'http://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    // 卡券详情页面
    var coupon_bag_host = 'http://ab.aikaka.com.cn/AcmpCola/CouponBagV2/webcouponshow_qr.html';
    // 引导关注页面
    var subscribe_a_url = "http://ab.aikaka.com.cn/shakeApp/activities1704/cola_translates/qr_a.html";
    var subscribe_b_url = "http://ab.aikaka.com.cn/shakeApp/activities1704/cola_translates/qr_b.html";
    // 各自活动的过渡页
    var translate_a_url = "http://ab.aikaka.com.cn/shakeApp/activities1704/cola_translates/translate_a.html";
    var translate_b_url = "http://ab.aikaka.com.cn/shakeApp/activities1704/cola_translates/translate_b.html";
    // 活动的id
    var activity_id_a=1008;
    var activity_id_b=1009;
} else if ($.trim(this_url).substr(0, 11) == "http://acmp") {
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    // 卡券详情页面
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/webcouponshow_qr.html';
    // 引导关注页面
    var subscribe_a_url = "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1704/cola_translates/qr_a.html";
    var subscribe_b_url = "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1704/cola_translates/qr_b.html";
    // 各自活动的过渡页
    var translate_a_url = "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1704/cola_translates/translate_a.html";
    var translate_b_url = "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1704/cola_translates/translate_b.html";
    // 活动的id
    var activity_id_a=1016;
    var activity_id_b=1015;    
}

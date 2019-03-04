var this_url = window.location.href;
if ($.trim(this_url).substr(0, 21) == "http://acmp.aikaka.cc") {
    var acmp_host = 'http://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/';
    // 核销二维码
    var cousume_url = "http://acmp.aikaka.cc/AcmpCola/Consume/index.html#/blank?coupon_code=";
    // 卡券的id
    var coupon_id = "1699";
    // item_id
    var activity_item_id = "1403";
    // A B活动的id
    var activity_id_a = "1016";
    var activity_id_b = "1015";
    var activity_id_c="1017";

    //授权接口
    var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=';
    // 判断是去岭印章还是抽奖
    var judgeUrl = "http://acmp.aikaka.cc/cocacola/shakeApp/activities1706/cola/judgeUrl.html";
    // 引导关注页面
    var subscribe_url = "http://acmp.aikaka.cc/cocacola/shakeApp/activities1706/cola/descQrCode.html";
    // 分享页面地址
    var share_url = "http://acmp.aikaka.cc/cocacola/shakeApp/activities1706/cola/share.html";
    // 问卷调查地址
    var question_url = "http://acmp.aikaka.cc/cocacola/shakeApp/activities1706/cola/question.html";

} else if ($.trim(this_url).substr(0, 25) == "http://acmp.aikaka.com.cn") {
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    // 核销二维码
    var cousume_url = "http://ab.aikaka.com.cn/Acmp/shakeFor/index.html#/blank?coupon_code=";
    // 卡券的id
    var coupon_id = "1700";
    // item_id
    var activity_item_id = "1409";
    // A B活动的id
    var activity_id_a = "1016";
    var activity_id_b = "1015";
    var activity_id_c="1017";
    //授权接口
    var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=';
    // 判断是去岭印章还是抽奖
    var judgeUrl = "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1706/cola/judgeUrl.html"
        // 引导关注页面
    var subscribe_url = "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1706/cola/descQrCode.html";
    // 分享页面地址
    var share_url = "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1706/cola/share.html";
    // 问卷调查地址
    var question_url = "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1706/cola/question.html";
} else if ($.trim(this_url).substr(0, 10) == "http://192") {
    var acmp_host = 'http://192.168.2.2/gaoyuan/Platform/AcmpApi_cocacola/';
    // 核销二维码
    var cousume_url = "http://ab.aikaka.com.cn/Acmp/shakeFor/index.html#/blank?coupon_code=";
    // 卡券的id
    var coupon_id = "1699";
    // item_id
    var activity_item_id = "1403";
    // A B活动的id
    var activity_id_a = "1016";
    var activity_id_b = "1015";
    var activity_id_c="1017";
    //授权接口
    var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=';
    // 判断是去岭印章还是抽奖
    var judgeUrl = "http://192.168.2.2/liuhao/activities/cola/judgeUrl.html"
        // 引导关注页面
    var subscribe_url = "http://192.168.2.2/liuhao/activities/cola/descQrCode.html";
    // 分享页面地址
    var share_url = "http://192.168.2.2/liuhao/activities/cola/share.html";
    // 问卷调查地址
    var question_url = "http://192.168.2.2/liuhao/activities/cola/question.html";
}
//记录分项的接口
var info_url_get = acmp_host + "share/record";
// 分享信息
var share_info = {
    title: "召唤你！可口可乐集印章兑好礼畅爽不停！",
    desc: "你si我好朋友...我才发给你哒...",
    imgUrl: "http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/uploads_temp/img/2017-05-11/5913d53cc91301494471996.png"
}

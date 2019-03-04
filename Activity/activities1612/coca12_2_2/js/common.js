
var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBag/';
var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/';
var qrcode_api = 'http://ab.aikaka.com.cn/PublicService/Util/qrcode.php?code=';
var oauth_url = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/base?callback_url=';
var store_list_url = 'http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1612/coca12_2_2/storelist.html';
var info_url_get=acmp_host+"AcmpApi/share/record";//分享统计接口
var info_ajax_url=acmp_host+"AcmpApi/share/click";//统计分享点击接口
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

wx.ready(function() {
    var store_list_with_from_openid = store_list_url + '?from_openid=' + localStorage.openid +'&from_unionid=' + localStorage.unionid + '&activity_id=' + localStorage.activity_id;
    var share_url = oauth_url + encodeURIComponent(store_list_with_from_openid);
    var content = "等你来拿";
    var shareData = {
        title: '喝可乐，攒好礼！等你来拿！',
        desc: '我正在参加喝可乐，攒好礼活动，邀请你来参加！',
        link: share_url,
        imgUrl: 'http://ab.aikaka.com.cn/Acmp/AcmpApi/uploads_temp/img/2016-09-05/57cced4844a7b1473047880.png'
    };
    var shareMessageData = {
        title: shareData.title,
        desc: shareData.desc,
        link: shareData.link,
        imgUrl: shareData.imgUrl,
        success: function() {
            $('.show_share').css("display", "none")
             getTime(localStorage.openid, "message", "1", localStorage.activity_id, info_url_get)
        },
        cancel: function() {
             $('.show_share').css("display", "none")
             getTime(localStorage.openid, "message", "0", localStorage.activity_id, info_url_get)
        }
    };
    var shareTimelineData = {
        title: shareData.title,
        desc: shareData.desc,
        link: shareData.link,
        imgUrl: shareData.imgUrl,
        success: function() {
            getTime(localStorage.openid, "time_line", "1", localStorage.activity_id, info_url_get)
        },
        cancel:function(){
            getTime(localStorage.openid, "time_line", "0", localStorage.activity_id, info_url_get)
        }
    };
    wx.onMenuShareAppMessage(shareMessageData);
    wx.onMenuShareTimeline(shareTimelineData);
});
//获取用户信息
function getTime(openid, way, result, activity_id,url_get) {
    var data = {}
    data.openid = openid;
    data.way = way;
    data.result = result;
    data.activity_id = activity_id;
    $.ajax({
        type: "POST",
        url: url_get,
        data: data,
        dataType: "json",
        success: function(data) {

        }
    })
}
//记录分享点击数量
function getuserinfo(openid, from_openid, activity_id, info_ajax_url) {
    if (from_openid && from_openid!="undefined") {
        var clickdata = {}
        clickdata.openid = openid;
        clickdata.from_openid = from_openid;
        clickdata.activity_id = activity_id;
        $.ajax({
            type: "POST",
            url: info_ajax_url,
            data: clickdata,
            dataType: "json",
            success: function(data) {

            }
        })
    }
}
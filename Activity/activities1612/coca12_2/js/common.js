// var acmp_host = 'http://ab.aikaka.com.cn/AcmpBeta/';
// var coupon_bag_host = 'http://ab.aikaka.com.cn/CouponBeta/';
// var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/user_info?callback_url=';
// var transit_url = 'http://ab.aikaka.com.cn/shakeApp/activities1612/coca12_2/transit.html?activity_id=462&from_openid=';

/**
 * acmp.aikaka.com.cn环境配置
 */
var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/';
var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBag/';
var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/base?callback_url=';
var oauth_userinfo_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/user_info?callback_url=';
var transit_url = 'http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1612/coca12_2/transit.html?activity_id=478&from_openid=';
var info_url_get=acmp_host+"AcmpApi/share/record";//分享统计接口
var info_ajax_url=acmp_host+"AcmpApi/share/click";//统计分享后点击分享页的接口

wx.ready(function() {
    var share_url = oauth_userinfo_api + encodeURIComponent(transit_url + urlGet()['openid']);
    var content = "等你来拿";
    var shareData = {
        title: '友情就是，一言不合，送你可乐！',
        desc: '我有几瓶可乐想和你分享。',
        link: share_url,
        imgUrl: 'http://ab.aikaka.com.cn/Acmp/AcmpApi/uploads_temp/img/2016-09-05/57cced4844a7b1473047880.png'
    };
    var shareMessageData = {
        title: shareData.title,
        desc: shareData.desc,
        link: shareData.link,
        imgUrl: shareData.imgUrl,
        success: function() {
             $('.show_share').css("display", "none");
             getTime(urlGet()["openid"], "message", "1", urlGet()["activity_id"],  info_url_get);
        },
        cancel: function() {
             $('.show_share').css("display", "none");
             getTime(urlGet()["openid"], "message", "0", urlGet()["activity_id"],  info_url_get);
        }
    };
    var shareTimelineData = {
        title: shareData.title,
        desc: shareData.desc,
        link: shareData.link,
        imgUrl: shareData.imgUrl,
        success: function() {
            $('.show_share').css("display", "none");
            getTime(urlGet()["openid"], "time_line", "1", urlGet()["activity_id"], info_url_get);
        },
        cancel:function(){
            $('.show_share').css("display", "none");
            getTime(urlGet()["openid"], "time_line", "0", urlGet()["activity_id"], info_url_get);
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
};
function getuserinfo(openid, from_openid, activity_id, info_ajax_url) {
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
function urlGet()
{
    var aQuery = window.location.href.split("?");//取得Get参数
    var aGET = new Array();
    if(aQuery.length > 1)
    {
        var aBuf = aQuery[1].split("&");
        for(var i=0, iLoop = aBuf.length; i<iLoop; i++)
        {
            var aTmp = aBuf[i].split("=");//分离key与Value
            aGET[aTmp[0]] = aTmp[1];
        }
    }
    return aGET;
}
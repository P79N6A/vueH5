var this_url = window.location.href;
if ($.trim(this_url).substr(0, 21) == "http://acmp.aikaka.cc") {
    // 测试地址
    var acmp_host = 'http://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cc/cocacola/CouponBagV2/';
    var first_item = "lottery-3895";
    var ques_activity_id = "1181";
    var ques_activity_item_id = "1593";
} else if ($.trim(this_url).substr(0, 25) == "http://acmp.aikaka.com.cn") {
    // 正式地址
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
}
var oauth_api = 'http://ab.aikaka.com.cn/PublicService/Weixin/oauth/base?callback_url=';
var info_url_get = acmp_host + "share/record"; //分享统计接口
var info_ajax_url = acmp_host + "share/click"; //点击分享链接的接口

//无openid授权
var openid = urlGet()['openid'];
alert(openid);
if(!openid || from_openid == "undefined"){
    window.location.href = oauth_api + encodeURIComponent(this_url);
}


var share_code_judge;
share_code_judge = urlGet()['share_code'];
// 统计分享后点击事件
if (share_code_judge) {
    getuserinfo(urlGet()['openid'], urlGet()['from_openid'], 999, share_code_judge, info_ajax_url)
}
share_data = {
    share_title : '德国高仪，臻享非凡家居！',
    share_details : "点滴风范 尽享淋漓\n\r购买高仪赢臻享礼赠\n\r更有VIP团购返现",
    share_url : 'http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1803/gaoyi/index.html?from=share&city=' + urlGet()['city'],
    share_icon : 'https://download.aikaka.com.cn/bba69b6abae1ca0960b0af2a917707d6'
};
wx.ready(function() {
    var share_url = share_data.share_url;
    var share_code = urlGet()['openid'] + Date.parse(new Date());
    var con;
    if (share_url.indexOf('?') >= 0) {
        con = '&';
    } else {
        con = '?';
    }
    var activity_url = share_url + con + "share_code=" + share_code + "&from_openid=" + urlGet()['openid'] + "&activity_id=" + 999;
    var wx_share_url = oauth_api + encodeURIComponent(activity_url);
    var shareData = {
        title: share_data.share_title,
        desc: share_data.share_details,
        link: wx_share_url,
        imgUrl: share_icon
    };
    var shareMessageData = {
        title: shareData.title,
        desc: shareData.desc,
        link: shareData.link,
        imgUrl: shareData.imgUrl,
        success: function() {
            if (share_code_judge) {
                getTime(urlGet()["openid"], "message", "1", activity_id, share_code, info_url_get, share_code_judge);
            } else {
                getTime(urlGet()["openid"], "message", "1", activity_id, share_code, info_url_get);

            }

        },
        cancel: function() {
            if (share_code_judge) {
                getTime(urlGet()["openid"], "message", "0", activity_id, share_code, info_url_get, share_code_judge);
            } else {
                getTime(urlGet()["openid"], "message", "0", activity_id, share_code, info_url_get);
            }

        }
    };
    var shareTimelineData = {
        title: shareData.title,
        desc: shareData.desc,
        link: shareData.link,
        imgUrl: shareData.imgUrl,
        success: function() {
            if (share_code_judge) {
                getTime(urlGet()["openid"], "time_line", "1", activity_id, share_code, info_url_get, share_code_judge);
            } else {
                getTime(urlGet()["openid"], "time_line", "1", activity_id, share_code, info_url_get);
            }

        },
        cancel: function() {
            if (share_code_judge) {
                getTime(urlGet()["openid"], "time_line", "0", activity_id, share_code, info_url_get, share_code_judge);
            } else {
                getTime(urlGet()["openid"], "time_line", "0", activity_id, share_code, info_url_get);
            }

        }
    };
    wx.onMenuShareAppMessage(shareMessageData);
    wx.onMenuShareTimeline(shareTimelineData);
});

function getuserinfo(openid, from_openid, activity_id, share_code_judge, info_ajax_url) {
    if (from_openid && from_openid != "undefined") {
        var clickdata = {}
        clickdata.openid = openid;
        clickdata.from_openid = from_openid;
        clickdata.activity_id = activity_id;
        clickdata.from_share_code = share_code_judge;
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
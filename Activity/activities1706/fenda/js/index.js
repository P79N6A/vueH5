var openid, activity_id, img_name, coupon_code;
var index_url = window.location.href;
var share_code_judge;
var share_data;
share_code_judge = urlGet()['share_code'];
openid = urlGet()['openid'];
activity_id = urlGet()['activity_id'];
// 存次数
var d = new Date();
var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + openid + activity_id;
if (localStorage[str]) {
    if (localStorage[str] <= 0) {
        $('.limit_times').html(0);
    } else {
        $('.limit_times').html(localStorage[str]);
    }
} else {
    localStorage[str] = 3;
    $('.limit_times').html(localStorage[str]);
}

// 统计分享后点击事件
if (share_code_judge) {
    getuserinfo(urlGet()['openid'], urlGet()['from_openid'], urlGet()['activity_id'], share_code_judge, info_ajax_url)
}
// 请求分享
$.ajax({
    type: "GET",
    url: acmp_host + "share/info?activity_id=" + activity_id,
    dataType: "json",
    success: function(data) {
        if (data.return_code = 200) {
            share_data = data.data;
            wx.ready(function() {
                var share_url = share_data.share_url;
                var share_code = urlGet()['openid'] + Date.parse(new Date());
                var con;
                if (share_url.indexOf('?') >= 0) {
                    con = '&';
                } else {
                    con = '?';
                }
                var activity_url = share_url + con + "share_code=" + share_code + "&from_openid=" + urlGet()['openid'] + "&activity_id=" + urlGet()['activity_id'];
                var wx_share_url = oauth_api + encodeURIComponent(activity_url);
                var shareData = {
                    title: share_data.share_title,
                    desc: share_data.share_details,
                    link: wx_share_url,
                    imgUrl: acmp_host + share_data.share_icon
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
        }
    }
});

$(".btn_").click(function(event) {
    $("#loadingToast").show();
    var getData = {};
    getData.openid = urlGet()['openid'];
    getData.activity_id = urlGet()['activity_id'];
    if (share_code_judge) {
        getData.from_share_code = urlGet()['share_code'];
        getData.from_openid = urlGet()['from_openid'];
    }
    $.ajax({
        type: "POST",
        url: acmp_host + "shakeFor/drawCoupon",
        data: getData,
        dataType: "json",
        success: function(data) {
            $("#loadingToast").hide();
            if (data.return_code != 200) {
                if (data.return_msg == "超出每人每天参与次数，欢迎明天继续参与") {
                    my_alert("confirm_error", "很遗憾", "超出每人每天参与次数", "欢迎明天继续参与", ["知道啦"], ["green"], function() {});
                } else {
                    my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function() {});
                };
            } else {
                img_name = data.data.coupon.title;
                coupon_code = data.data.coupon_code;
                if (img_name == "600ml芬达汽水买一赠一" || img_name.indexOf("买一赠一") > -1) {
                    $(".coupon_img").attr("src", "img/fd.png");
                    $(".coupon_title").html("买一赠一券");
                    $(".coupon_desc").html("芬达汽水买1瓶赠1瓶（同品）").css("text-indent", "0.9rem");
                } else if (img_name == "600ml芬达汽水免费领" || img_name.indexOf("免费") > -1) {
                    $(".coupon_img").attr("src", "img/fd.png");
                    $(".coupon_title").html("免费赠饮券");
                    $(".coupon_desc").html("芬达汽水1瓶").css("text-indent", "0rem");
                } else if (img_name == "海南桥沙红薯优惠券" || img_name.indexOf("红薯") > -1) {
                    $(".coupon_img").attr("src", "img/zd.png");
                    $(".coupon_title").html("真的有料水果礼券");
                    $(".coupon_desc").html("海南桥沙红薯优惠券").css("text-indent", "0rem");
                } else if (img_name == "云南楚雄高原蓝莓优惠券" || img_name.indexOf("蓝莓") > -1) {
                    $(".coupon_img").attr("src", "img/zd.png");
                    $(".coupon_title").html("真的有料水果礼券");
                    $(".coupon_desc").html("云南楚雄高原蓝莓优惠券").css("text-indent", "0rem");
                } else if (img_name == "Gofun出行优惠券" || img_name.indexOf("出行") > -1) {
                    $(".coupon_img").attr("src", "img/gf.png");
                    $(".coupon_title").html("Gofun出行优惠券");
                    $(".coupon_desc").html("Gofun出行优惠券").css("text-indent", "0rem");
                }
                $(".show_box").show();
                var lift_time = localStorage[str];
                lift_time--;
                localStorage[str] = lift_time;
            }
        },
        error: function() {
            $("#loadingToast").hide();
            my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
        }
    });
});

$(".get_coupon").click(function(event) {
    if (img_name == "600ml芬达汽水买一赠一" || img_name.indexOf("芬达") > -1 || img_name == "600ml芬达汽水免费领") {
        window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + openid;
    } else {
        window.location.href = coupon_bag_host + 'webcouponthird_party.html' + "?coupon_code=" + coupon_code + "&openid=" + openid;
    }
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
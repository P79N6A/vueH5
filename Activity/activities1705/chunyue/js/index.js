var openid, activity_id, share_code_judge, share_data, coupon_code, img_name, third_party_openid, third_party_name;
var index_url = window.location.href;
share_code_judge = urlGet()['share_code'];
openid = urlGet()['openid'];
activity_id = urlGet()['activity_id'];
third_party_openid = urlGet()['cola_openid'];
third_party_name = "liyuxiaoke";
if (typeof(third_party_openid) == "undefined") {
    var _url = "http://cola-bj.iblacktree.com/Index/checkAuth/?openid_field=cola_openid&callback_url=" + encodeURIComponent(index_url);
    window.location.href = _url;
} else {
    document.write("<script src='http://ab.aikaka.com.cn/PublicService/Weixin/js/wxjspsdk.js'>" + "<" + "/script>");
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
                    var activity_url = share_url + "?share_code=" + share_code + "&from_openid=" + urlGet()['openid'] + "&activity_id=" + urlGet()['activity_id'];
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
    $(".btn_").removeAttr("disabled");

    $(".btn_").click(function(event) {
        $(".btn_").attr('disabled',"true");
        var getData = {};
        getData.openid = urlGet()['openid'];
        getData.activity_id = urlGet()['activity_id'];
        getData.third_party_openid = third_party_openid;
        getData.third_party_name = third_party_name;
        if (share_code_judge) {
            getData.from_share_code = urlGet()['share_code'];
            getData.from_openid = urlGet()['from_openid'];
        }
        if (!activity_id) {
            my_alert("confirm_error", "很遗憾", "缺少必要的活动ID", "", ["知道啦"], ["green"], function() {});
            return false
        }
        if (!openid) {
            my_alert("confirm_error", "很遗憾", "缺少必要的用户信息", "", ["知道啦"], ["green"], function() {});
            return false
        }
        $("#loadingToast").show();
        $.ajax({
            type: "POST",
            url: acmp_host + "shakeFor/drawCoupon",
            data: getData,
            dataType: "json",
            success: function(data) {
                $("#loadingToast").hide();
                $(".btn_").removeAttr("disabled");
                if (data.return_code != 200) {
                    if (data.return_msg == "超出每人每天参与次数，欢迎明天继续参与") {
                        my_alert("confirm_error", "很遗憾", "超出每人每天参与次数", "欢迎明天继续参与", ["知道啦"], ["green"], function() {});
                    } else {
                        my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function() {});
                    };
                } else {
                    coupon_code = data.data.coupon_code;
                    img_name = data.data.coupon.title;
                    if (img_name == "纯悦1.5L包装饮用水买一赠一" || img_name.indexOf("饮用水") > 0) {
                        $(".coupon_img").attr("src", "img/gift.png");
                        $(".get_coupon").css("background-image", "url(img/get_coupon.png)");
                    } else {
                        $.ajax({
                            type: "POST",
                            url: acmp_host + "consume/scrape",
                            data: { coupon_code: coupon_code },
                            success: function(data) {}
                        });
                        $(".coupon_img").attr("src", "img/no_gift.png");
                        $(".get_coupon").css("background-image", "url(img/sorry.png)");
                    }
                    $(".show_box").show();
                }
            },
            error: function() {
                $("#loadingToast").hide();
                my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
            }
        });
    });

    $(".get_coupon").click(function(event) {

        if (img_name == "纯悦1.5L包装饮用水买一赠一" || img_name.indexOf("买一赠一") > 0) {
            if (urlGet()['subscribe'] == 1) {
                window.location.href ='http://ab.aikaka.com.cn/ShortUrl/location/redirect?url=KNuDKrifj1'
                // window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + urlGet()['openid'];
            } else {
                window.location.href = "http://mp.weixin.qq.com/s/9wcSAnqW4TiPJ6t7jC0muA";
            }
            
        } else {
            $(".show_box").hide();
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
}

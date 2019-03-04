var third_party_openid, openid, activity_id, third_party_name, img_name, coupon_code;
var index_url = window.location.href;
var share_code_judge;
var share_data;
share_code_judge = urlGet()['share_code'];
openid = urlGet()['openid'];
activity_id = urlGet()['activity_id'];
third_party_openid = urlGet()['cola_openid'];
third_party_name = "liyuxiaoke";
// 存次数
var d = new Date();
var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
if (localStorage[str]) {
    $('.limit_times').html(localStorage[str]);
} else {
    localStorage[str] = 3;
    $('.limit_times').html(localStorage[str]);
}
if (typeof(third_party_openid) == "undefined") {
    var _url = "http://kele.keliaier.com/h5/keleuserintf.jspx?callback_url=" + encodeURIComponent(index_url);
    window.location.href = _url;
} else {
    document.write("<script src='http://ab.aikaka.com.cn/PublicService/Weixin/js/wxjspsdk.js'>" + "<" + "/script>");
    // 统计分享后点击事件
    if (share_code_judge) {
        getuserinfo(urlGet()['openid'], urlGet()['from_openid'], urlGet()['activity_id'], share_code_judge, info_ajax_url)
    }
    var now_img;
    var img_box = [
        { "img_name": "樱桃味可口可乐汽水买一赠一", "img_src": "buy" },
        { "img_name": "500ml樱桃可乐免费领", "img_src": "free" },
        { "img_name": "真的有料满减优惠券", "img_src": "zd_mj" },
        { "img_name": "樱桃65折优惠券", "img_src": "zd_yt" },
        { "img_name": "台湾金钻凤梨65折优惠券", "img_src": "zd_fl" },
        { "img_name": "30元代金券", "img_src": "q_cash" },
        { "img_name": "兄弟套餐优惠券", "img_src": "q_brother" },
        { "img_name": "权金城买一赠一优惠券", "img_src": "q_buy" },
        { "img_name": "姐妹套餐优惠券", "img_src": "q_sister" },
        { "img_name": "全单7折优惠券", "img_src": "qw_7" },
        { "img_name": "权味买一赠一优惠券", "img_src": "qw_buyone" },
        { "img_name": "Gofun出行优惠券", "img_src": "gf" },
    ];
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
        getData.third_party_openid = third_party_openid;
        getData.third_party_name = third_party_name;
        if (share_code_judge) {
            getData.from_share_code = urlGet()['share_code'];
            getData.from_openid = urlGet()['from_openid'];
        }
        if (localStorage[str] == 3) {
            getData.activity_item_id = "lottery-2734";
        }
        // if(localStorage[str] == 0){
        //    $("#loadingToast").hide();
        //    my_alert("confirm_error", "很遗憾", "超出每人每天参与次数", "欢迎明天继续参与", ["知道啦"], ["green"], function() {});
        //    return false
        // }

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

                    for (var i = 0; i < img_box.length; i++) {
                        if (img_name == img_box[i].img_name) {
                            now_img = img_box[i].img_src;
                        }
                    }
                    $(".coupon_img").attr("src", "img/" + now_img + ".png");
                    if (img_name == "樱桃味可口可乐汽水买一赠一" || img_name == "500ml樱桃可乐免费领") {
                         $(".get_coupon").css("background-image","url(img/cola.png)")
                    }else{
                         $(".get_coupon").css("background-image","url(img/button.png)")
                    }
                    $(".show_box").show();
                    var lift_time = localStorage[str];
                    lift_time--;
                    if (lift_time < 0) {
                        localStorage[str] = "0";
                    } else {
                        localStorage[str] = lift_time;
                    }
                }
            },
            error: function() {
                $("#loadingToast").hide();
                my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
            }
        });

    });

    $(".get_coupon").click(function(event) {
        if (img_name == "樱桃味可口可乐汽水买一赠一" || img_name == "500ml樱桃可乐免费领") {
            window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + openid;
            // window.location.href = "http://ab.aikaka.com.cn/shakeApp/activities/qr_entry/Coupon/" + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + openid;
        } else {
            if (urlGet()['substribe'] == 1) {
                window.location.href = coupon_bag_host + 'webcouponthird_party.html' + "?coupon_code=" + coupon_code + "&openid=" + openid;
                // window.location.href = "http://ab.aikaka.com.cn/shakeApp/activities/qr_entry/Coupon/" + 'webcouponthird_party.html' + "?coupon_code=" + coupon_code + "&openid=" + openid;
            } else {
                window.location.href = "http://mp.weixin.qq.com/s/9wcSAnqW4TiPJ6t7jC0muA";
            }
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

var this_url = window.location.href;
if ($.trim(this_url).substr(0, 9) == "http://ab") {
    var acmp_host = 'http://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    var coupon_bag_host = 'http://ab.aikaka.com.cn/AcmpCola/CouponBagV2/';
} else if ($.trim(this_url).substr(0, 11) == "http://acmp") {
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
}
openid = urlGet()['openid'];
activity_id = urlGet()['activity_id'];
store_code = urlGet()['store_code'];

$(document).ready(function() {
    $('#click3').click(function() {
        $("#loadingToast").show();
        var getData = {}
        getData.openid = openid;
        getData.activity_id = activity_id;
        getData.store_code = store_code;
        $.ajax({
            type: "POST",
            url: acmp_host + "prize/lottery",
            data: getData,
            dataType: "json",
            success: function(data) {
                $("#loadingToast").hide();
                if (data.return_code != 200) {
                    if (data.return_msg == "超出每人每天参与次数，欢迎明天继续参与") {
                        my_alert("confirm_error", "很遗憾", "超出每人每天参与次数", "欢迎明天继续参与", ["知道啦"], ["green"], function() {});
                    } else {
                        if(data.return_msg == '谢谢参与'){
                            $(".show_box1").show()
                        }else{
                            my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function() {});
                        }
                    };
                } else {
                    //获取奖品
                    var coupon_code = data.data.coupon_code;
                    var coupon_url = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + urlGet()['openid'];
                    var qr = encodeURIComponent(coupon_url);
                    qr_url = 'http://ab.aikaka.com.cn/PublicService/Util/qrcode.php?code=' + qr;

                    $('.btn').attr('src', qr_url);
                    $('.show_box').fadeIn();
                }
            },
            error: function() {
                $(".show_box1").show()
            }
        });
    });
});
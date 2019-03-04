var this_url = window.location.href;
if ($.trim(this_url).substr(0, 9) == "http://ab") {
    var acmp_host = 'http://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    var coupon_bag_host = 'http://ab.aikaka.com.cn/AcmpCola/CouponBagV2/';
} else if ($.trim(this_url).substr(0, 11) == "http://acmp") {
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
}

activity_id = urlGet()['activity_id'];
openid = urlGet()['openid'];
item = '';
$(function(){
    $('.info').click(function(){
        $('.show_box1').show();
    });
    $('.info_bike').click(function(){
        $('.show_box2').show();
    });
    $('.show_100').click(function(){
        $('.show_box1').hide();
        $('.show_box2').hide();
    });
    $('.pointer').click(function() {
        $("#loadingToast").show();
        var getData = {}
        getData.openid = openid;
        getData.activity_id = activity_id;
        getData.store_code = 'AIKAKATEST002';
        $.ajax({
            type: "POST",
            url: acmp_host + "prize/lottery",
            data: getData,
            dataType: "json",
            success: function(data) {
                $("#loadingToast").hide();

                if (data.return_code != 200) {
                    my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function() {});
                } else {
                    GetSelect = data.data.coupon.title; //从后台拿数据
                    coupon_code = data.data.coupon_code;
                    if (GetSelect.indexOf("E卡") > 0) {
                        item = 1
                        localStorage['coupon_code'] = coupon_code;
                        $(".alert_gift_box").css({ "background-image": "url(images/prize1.png)", "top": "5%" });
                    } else {
                        item = 2
                        $('.notice').show();
                        $(".alert_gift_box").css({ "background-image": "url(images/prize2.png)" });
                    }
                    $('.show_box').show();
                }
            },
            error: function() {
                $("#loadingToast").hide();
                my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
            }
        });
    });
});

// 点击跳转
$(".alert_gift_box").click(function(event) {
    if(item == 2){
        window.location.href = 'https://gsactivity.diditaxi.com.cn/gulfstream/activity/v2/giftpackage/index?g_channel=681a3336b5785ade2c81e8d5f78f5663';
    }else{
        window.location.href = 'submit.html';
    }
});
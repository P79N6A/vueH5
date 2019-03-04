var this_url = window.location.href;
if ($.trim(this_url).substr(0, 9) == "http://ab") {
    var acmp_host = 'http://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    var coupon_bag_host = 'http://ab.aikaka.com.cn/AcmpCola/CouponBagV2/';
} else if ($.trim(this_url).substr(0, 11) == "http://acmp") {
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
}
var info_ajax_url = acmp_host + "share/click"; //点击分享链接的记录接口

$(function(){
    wx.ready(function() {
        //隐藏右上角菜单禁用分享
        wx.hideOptionMenu()
    });
    // 统计进入活动
    var clickdata = {}
    clickdata.openid = urlGet()["openid"];
    clickdata.from_openid = urlGet()["from_openid"] ? urlGet()["from_openid"] : 'null';
    clickdata.activity_id = urlGet()["activity_id"];
    clickdata.from_share_code = urlGet()["from"];
    $.ajax({
        type: "POST",
        url: info_ajax_url,
        data: clickdata,
        dataType: "json",
        success: function(data) {
            
        }
    })

    //检查是否有历史卡券
    $.ajax({
        type: "POST",
        url: acmp_host + "couponRecord/list",
        data: {'akk_openid':clickdata.openid, 'skip': 0, 'size' : 1},
        dataType: "json",
        success: function(data) {
            if(data.data.list.length == 0){
                return false;
            }
            var first_coupon = data.data.list[0];
            if((first_coupon.id == 1953 || first_coupon.id == 1952) && first_coupon.record_status != 'CONSUMED'){
                coupon_code = first_coupon.coupon_code;
                window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + sessionStorage["openid"];
            }
        }
    })

    //请求领取卡券
    $("body>*").bind("click",function(){});
    $(document).on('click', '.getPrize', function(){
        $("#loadingToast").show();
        var getData = {}
        getData["activity_id"] = sessionStorage["activity_id"];
        getData["openid"] = sessionStorage["openid"];
        getData["store_code"] = sessionStorage["store_code"];
        getData["from"] = sessionStorage["from"];
        getData["activity_item_id"] = sessionStorage["activity_item_id"];
        getData["from_openid"] = sessionStorage["from_openid"];
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
                    coupon_code = data.data.coupon_code;
                    window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + sessionStorage["openid"];
                }
            },
            error: function() {
                my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
            }
        });
    });
});
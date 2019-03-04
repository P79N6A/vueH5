var openid, activity_id, coupon_code;
openid = urlGet()['openid'];
activity_id = urlGet()['activity_id'];
wx.ready(function () {
    //隐藏右上角菜单禁用分享
       wx.hideOptionMenu()
});
var a,b,c;
$('.ques_1').css({"background":"url(img/n.png)","background-size":"100% 100%"})
$('.span_1').click(function(){
    a=$(this).siblings("span").html()
    $(this).css({"background":"url(img/y.png)","background-size":"100% 100%"}).addClass('checkYes');
    $('.span_1').not(this).css({"background":"url(img/n.png)","background-size":"100% 100%"}).removeClass('checkYes');
})
$('.span_2').click(function(){
    b=$(this).siblings("span").html()
    $(this).css({"background":"url(img/y.png)","background-size":"100% 100%"}).addClass('checkYes');
    $('.span_2').not(this).css({"background":"url(img/n.png)","background-size":"100% 100%"}).removeClass('checkYes');
})
$('.span_3').click(function(){
    c=$(this).siblings("span").html()
    $(this).css({"background":"url(img/y.png)","background-size":"100% 100%"}).addClass('checkYes');
    $('.span_3').not(this).css({"background":"url(img/n.png)","background-size":"100% 100%"}).removeClass('checkYes');
})

$(".btn_").click(function(event) {
    if($('.checkYes').length!=3){
       my_alert("confirm_error", "友情提示", "请先填完问卷调查", "", ["知道啦"], ["green"], function() {});
       return false 
    }
    var getData = {};
    getData.openid = urlGet()['openid'];
    getData.activity_id = urlGet()['activity_id'];
    getData.buyer_get_info=a+"||"+b+"||"+c;
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
            if (data.return_code != 200) {
                if (data.return_msg == "超出每人每天参与次数，欢迎明天继续参与") {
                    my_alert("confirm_error", "很遗憾", "超出每人每天参与次数", "欢迎明天继续参与", ["知道啦"], ["green"], function() {});
                } else {
                    my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function() {});
                };
            } else {
                coupon_code = data.data.coupon_code;
                $(".show_box").show();
            }
        },
        error: function() {
            $("#loadingToast").hide();
            my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
        }
    });
});

$(".coupon_img").click(function(event) {
        window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + urlGet()['openid'];
});

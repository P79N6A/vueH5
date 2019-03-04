var this_url = window.location.href;
if ($.trim(this_url).substr(0, 10) == "https://ab") {
    var acmp_host = 'https://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    var coupon_bag_host = 'https://ab.aikaka.com.cn/AcmpCola/CouponBagV2/';
} else if ($.trim(this_url).substr(0, 12) == "https://acmp") {
    var acmp_host = 'https://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'https://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
}
openid = urlGet()['openid'];
activity_id = urlGet()['activity_id'];
store_code = urlGet()['store_code'];

$(document).ready(function() {
    $('.pointer').click(function() {
        $("#loadingToast").show();
        var getData = {}
        getData.openid = openid;
        getData.activity_id = activity_id;
        getData.store_code = store_code;
        getData.code = urlGet()['token'];
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
                    } else if(data.return_msg == '很抱歉！本次抽奖未中奖！'){
                        my_alert("confirm_error", "很遗憾", "此二维码已使用过", "每个二维码只能参与一次活动哦~", ["知道啦"], ["green"], function() {});
                    } else if(data.return_msg == '谢谢参与'){
                        my_alert("confirm_error", "很遗憾", "这次未中奖哦", "", ["知道啦"], ["green"], function() {});
                    }else{
                        my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function() {});
                    }
                } else {
                    //获取奖品
                    coupon_id = data.data.coupon.id; //从后台拿数据
                    sessionStorage['closeNow'] = 0;
                    if(coupon_id == 2038){
                        var prize_pic = 'images/x1.png';
                    }
                    else if(coupon_id == 2037){
                        var prize_pic = 'images/x5.png';
                    }
                    else if(coupon_id == 2036){
                        var prize_pic = 'images/x88.png';
                    }
                    else{
                        var prize_pic = 'images/x0.png';
                        sessionStorage['closeNow'] = 1;
                    }
                    $('.prizePic').attr('src', prize_pic);
                    $('.show_box').fadeIn();
                }
                prizeList();
            },
            error: function() {
                my_alert("confirm_error", "很遗憾", "这次未中奖哦", "", ["知道啦"], ["green"], function() {});
                
            }
        });


    });
});

wx.ready(function() {
    //隐藏右上角菜单禁用分享
    wx.hideOptionMenu()
    prizeList();
});

function prizeList(){
    //检查是否有历史卡券
    $.ajax({
        type: "POST",
        url: acmp_host + "couponRecord/list",
        data: {'akk_openid':urlGet()['openid'], 'activity_id':urlGet()['activity_id'], 'skip': 0, 'size' : 100},
        dataType: "json",
        success: function(data) {
            if(data.data.list.length == 0){
                return false;
            }
            var count = 0;
            var prize = [];
            for(var i in data.data.list){
                count ++;
                console.log()
                if(data.data.list[i].id == 2038){
                    var pic = 'images/1.png';
                }else if(data.data.list[i].id == 2037){
                    var pic = 'images/5.png';
                }else if(data.data.list[i].id == 2036){
                    var pic = 'images/88.png';
                }else{
                    count --;
                    continue;
                }
                prize.push('<div class="myPrizeShow"><img class="prizeClass" src="'+pic+'"><p class="prizeNo">'+count+'</p></div>');
            }
            $('.myPrizeList').html('');
            if(prize.length > 0){
                $('.myPrizeList').html('');
                for(var j in prize){
                    $('.myPrizeList').append(prize[j]);
                }
            }
        }
    })
}

$(function(){

    // 统计进入活动
    var clickdata = {}
    clickdata.openid = urlGet()["openid"];
    clickdata.from_openid = urlGet()["from_openid"] ? urlGet()["from_openid"] : 'null';
    clickdata.activity_id = urlGet()["activity_id"];
    clickdata.from_share_code = urlGet()["from"] ? urlGet()["from"] : 'scan';
    var info_ajax_url = acmp_host + "share/click"; //点击分享链接的记录接口
    $.ajax({
        type: "POST",
        url: info_ajax_url,
        data: clickdata,
        dataType: "json",
        success: function(data) {
            
        }
    })


    $('.prize').click(function(){
        $('.myPrize').fadeIn();
    });
    $('.notice').click(function(){
        $('.myNotice').fadeIn();
    });
    $('.myPrizeClose').click(function(){
        $('.myPrize').fadeOut();
    });
    $('.noticeClose').click(function(){
        $('.myNotice').fadeOut();
    });
    $('.alert_gift_box').click(function(){
        $('.show_box').fadeOut();
        if(sessionStorage['closeNow'] != 1){
            sessionStorage['closeNow'] = 0;
            $('.show_box1').fadeIn();
        }
    });
    $('.okAndClose').click(function(){
        wx.closeWindow();
    });
});
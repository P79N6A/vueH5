//路径定义
var this_url = window.location.href;
if ($.trim(this_url).substr(0, 10) == "https://ab") {
    var acmp_host = 'https://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    var coupon_bag_host = 'https://ab.aikaka.com.cn/AcmpCola/CouponBagV2/';
} else if ($.trim(this_url).substr(0, 12) == "https://acmp") {
    var acmp_host = 'https://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'https://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
}

//全局参数
openid = urlGet()['openid'];
activity_id = urlGet()['activity_id'];
store_code = urlGet()['store_code'];
ocode = urlGet()['token'];

//业务开始
$(document).ready(function() {
    //固定屏幕高度
    $('body,html').height(document.body.clientHeight);

    //播放菊花
    $("#loadingToast").show();

    //进入播放音乐
    var myAuto = document.getElementById('myaudio');
    if (localStorage.music != 0) {
        myAuto.play();
    } else {
        $('#audio_btn').toggleClass("rotate");
    }

    //点击停止播放
    $('#audio_btn').click(function () {
        $(this).toggleClass("rotate"); //控制音乐图标 自转或暂停
        //控制背景音乐 播放或暂停            
        if ($(this).hasClass("rotate")) {
            localStorage.music = 1;
            myAuto.play();
        } else {
            localStorage.music = 0;
            myAuto.pause();
        }
    });

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

    //历史记录
    myHistory();
    function myHistory(){
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
                    var coupon_id = data.data.list[i].id;
                    var coupon_code = data.data.list[i].coupon_code;
                    var get = 'got';
                    if(coupon_id == 2040){
                        var pic = 'images/text1.png';
                        if(data.data.list[i].record_status != 'CONSUMED'){
                            get = 'get';
                        }
                    }else if(coupon_id == 2041){
                        var pic = 'images/text2.png';
                    }else if(coupon_id == 2042){
                        var pic = 'images/text3.png';
                    }else if(coupon_id == 2043){
                        var pic = 'images/text4.png';
                    }else{
                        count --;
                        continue;
                    }
                    
                    var get_pic = 'images/c_'+get+'.png';
                    prize.push('<div class="myPrizeShow"><img class="prizeClass" src="images/prize.png">'
                        + '<p class="prizeNo">'+count+'</p><img class="text" src="'+pic+'">'
                        + '<img class="got" src="'+get_pic+'" data-get="'+get+'" data-code="'+coupon_code+'"></div>');
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
    
    wx.ready(function () {
        //配置分享
        var shareMessageData = {
            title: '开箱扫码',
            desc: '抢购物卡',
            link: 'https://acmp.aikaka.com.cn/cocacola/shakeApp/activities1812/share/index.html',
            imgUrl: 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/uploads_temp/img/2018-11-28/5bfdfc6381e821543371875.png'
        };
        var shareTimelineData = {
            title: '开箱扫码',
            desc: '抢购物卡',
            link: 'https://acmp.aikaka.com.cn/cocacola/shakeApp/activities1812/share/index.html',
            imgUrl: 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/uploads_temp/img/2018-11-28/5bfdfc6381e821543371875.png'
        };
        wx.onMenuShareAppMessage(shareMessageData);
        wx.onMenuShareTimeline(shareTimelineData);

        //预检查
        wx.getLocation({
            success: function (res) {
                let longitude = res.longitude
                let latitude = res.latitude
                $.ajax({
                    type: "POST",
                    url: acmp_host + "prize/preCheck",
                    data: { 'openid': openid, 'code': ocode, 'latitude': latitude, 'longitude': longitude },
                    dataType: "json",
                    success: function (data) {
                        if (data.return_code == 200) {
                            //code生效，可以开始抽奖了
                            $("#loadingToast").hide();
                            starts = true
                        } else {
                            $("#loadingToast").hide();
                            my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function () { });
                        }
                    },
                    error: function (data) {
                        console.log('error')
                    }
                })
            },
            cancel: function (res) {
                my_alert("confirm_error", "很抱歉", "无法进行抽奖！", "原因：我们无法获取您的地理位置", ["知道啦"], ["green"], function () { getUserLocation() });

            }
        })
    });
    
    //开始抽奖
    $('.pointer').click(function() {
        $("#loadingToast").show();
        sessionStorage.this_coupon_code = 0;
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
                    } else {
                        if(data.return_msg == '谢谢参与'){
                            my_alert("confirm_error", "很遗憾", "这次未中奖哦", "", ["知道啦"], ["green"], function() {});
                        }else{
                            my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function() {});
                        }
                    };
                } else {
                    //获取奖品
                    var coupon_id = data.data.coupon.id; //从后台拿数据
                    var prize_get = 'images/b_get.png';
                    if(coupon_id == 2040){
                        var prize_pic = 'images/p1.png';
                        var prize_get = 'images/b_submit.png';
                        sessionStorage.this_coupon_code = data.data.coupon_code;
                    }else if(coupon_id == 2041){
                        var prize_pic = 'images/p2.png';
                    }else if(coupon_id == 2042){
                        var prize_pic = 'images/p3.png';
                    }else if(coupon_id == 2043){
                        var prize_pic = 'images/p4.png';
                    }else{
                        my_alert("confirm_error", "很遗憾", "这次未中奖哦", "", ["知道啦"], ["green"], function() {});
                        return false;
                    }
                    $('.prizePic').attr('src', prize_pic);
                    $('.prizeGet').attr('src', prize_get);
                    $('.show_box').fadeIn();
                }
            },
            error: function() {
                my_alert("confirm_error", "很遗憾", "这次未中奖哦", "", ["知道啦"], ["green"], function() {});
                
            }
        });
    });

    //弹窗开关
    $('.prize').click(function(){
        $('.myPrize').fadeIn();
    });
    $('.myPrizeClose').click(function(){
        $('.myPrize').fadeOut();
        $('.connect').fadeOut();
    });
    $('.okAndClose').click(function(){
        wx.closeWindow();
    });
    $('.ok').click(function(){
        $('.connect').fadeOut();
    });
    $('.prizeGet').click(function(){
        $('.show_box').fadeOut();
        if(sessionStorage.this_coupon_code == 0){
            $('.show_box1').fadeIn();
        }else{
            $('.write').fadeIn();
        }
    });
    $('.notice').click(function(){
        window.open('../share/index.html?from=AS');
    });

    //填写大奖信息
    $("body>*").bind("click",function(){});
    $(document).on('click', '.got', function(){
        if($(this).data('get') == 'got'){
            return false;
        }
        $('.myPrize').fadeOut();
        $('.write').fadeIn();
        sessionStorage.this_coupon_code = $(this).data('code');
    });

    //填写信息提交
    $('.sub').click(function(){
        var user_info = checkAndWarn();
        if(!user_info){
            return false;
        }

        //提交中奖信息
        $("#loadingToast").show();
        user_info.coupon_code = sessionStorage.this_coupon_code
        $.ajax({
            type: "POST",
            url: acmp_host + "prize/updateUserInfo",
            data: user_info,
            dataType: "json",
            success: function(data) {
                if(data.return_code == 200){
                    $.ajax({
                        type: "POST",
                        url: acmp_host + "consume/scrape",
                        data: user_info,
                        dataType: "json",
                        success:function(data) {
                            $("#loadingToast").hide();
                            $('.write').fadeOut();
                            $('.connect').fadeIn();
                            sessionStorage.this_coupon_code = 0;
                            myHistory();
                        }
                    });
                }else{
                    my_alert("confirm_error", "很遗憾", "网络不畅，请重新提交", "", ["知道啦"], ["green"], function() {}); 
                }
            },
            error: function() {
                my_alert("confirm_error", "很遗憾", "网络不畅，请重新提交", "", ["知道啦"], ["green"], function() {}); 
            }
        });
    });

    //填写信息检查
    function checkAndWarn(){
        var user_info = {};
        user_info.buyer_name = $('.buyer_name').val();
        user_info.buyer_mobile = $('.buyer_mobile').val();
        user_info.buyer_addr = $('.buyer_addr').val();
        var pass = true;
        for(var i in user_info){
            var this_msg = user_info[i];
            if(this_msg.length == 0 || this_msg.length > 20){
                warnInput(i);
                pass = false;
            }
        }
        if(pass){
            return user_info;
        }
        return pass;
    }
    //警告
    function warnInput(this_class){
        $('.'+this_class).css('border-color', 'red');
    }
    //解除警告
    $('input').click(function(){
        $(this).css('border-color', '#d6a770');
    });

});
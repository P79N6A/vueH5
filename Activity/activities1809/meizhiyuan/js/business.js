$.getJSON("config.json", function (result) {
    var my_url = getHTUrl()
    var acmp_host = my_url.acmp_host
    var coupon_bag_host = my_url.coupon_bag_host
    var turnplate = result.turnplate
    var prize_config = result.prize
    var openid = urlGet()['openid']
    var activity_id = urlGet()['activity_id']
    var store_code = urlGet()['store_code']
    if(!openid){
        authorize(activity_id, store_code)
    }
    //实例化翻页功能
    var mySwiper = new Swiper ('.swiper-container', {
        direction : 'vertical',
        effect : 'flip',
        slidesPerView: 1,
        centeredSlides : true,
        noSwiping : true,
        // noSwipingClass : 'stop-swiping',
        navigation: {
          nextEl: '.button',
        }
    }) 
    $(document).ready(function () {

        let GetSelect
        $('body,html').height(document.body.clientHeight);
        $(".button1").click(function(){
            if(readys){
                mySwiper.slideTo(1)
            }
        })
        $('.pointer').click(function () {
            if (turnplate.bRotate) return
            $("#loadingToast").show();
            let item = 1
            var getData = {}
            getData.openid = openid
            getData.activity_id = activity_id
            getData.store_code = urlGet()['store_code']
            
            $.ajax({
                type: "POST",
                url: acmp_host + "prize/lottery",
                data: getData,
                dataType: "json",
                success: function (data) {
                    $("#loadingToast").hide();
                    if (data.return_code != 200) {
                        if (data.return_msg == "超出每人每天参与次数，欢迎明天继续参与") {
                            my_alert("confirm_error", "很遗憾", "超出每人每天参与次数", "欢迎明天继续参与", ["知道啦"], ["green"], function () { });
                        } else {
                            if (data.return_msg == '谢谢参与') {
                                $(".alert_gift_box").css({ "background-image": "url(images/xiexie.png)", "top": "5%" })
                                item = 1
                                rotateFn(item, function () {
                                    $(".show_box").show();
                                });
                            } else {
                                my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function () { });
                            }
                        };
                    } else {
                        turnplate.bRotate = !turnplate.bRotate;
                        //获取奖品
                        GetSelect = data.data.coupon.id; //从后台拿数据
                        coupon_code = data.data.coupon_code;
                        localStorage[result.sessionKey] = coupon_code
                        if (GetSelect == 2021) {
                        //买一赠一
                            //mySwiper.slideTo(1)
                            $("#item").attr("src","images/page2/yo.png")
                            item = 2
                        } else if (GetSelect == 2022) {
                            //北京杜莎夫人蜡像馆大城
                            item = 1
                            $("#item").attr("src","images/page2/dx2.png")
                            //window.location.href = coupon_bag_host + 'webcouponthird_party.html' + "?coupon_code=" + coupon_code + "&openid=" + openId
                        } else if (GetSelect == 2023) {
                            //大城小像免费门票一张
                            item = 3
                            $("#item").attr("src","images/page2/dx.png")
                        }
                        rotateFn(item, function () {
                            $(".alertContent").show();
                        });
                    }
                },

                error: function (rest) {
                    my_alert("confirm_error", "很遗憾", "出错了", "请刷新重试", ["知道啦"], ["green"], function () { });
                    item = 1;
                    rotateFn(item, function () {
                        $(".alert").show()
                    });
                    //my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
                }
            });
        })
        // 点击跳到卡券页
        $("#item").click(function (event) {
            $(".alert").hide()
            if(GetSelect == 2021){
                window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + localStorage[result.sessionKey] + "&openid=" + openid;
            }else if(GetSelect == 2022){
                window.location.href = coupon_bag_host + 'webcoupon_yo.html' + "?coupon_code=" + localStorage[result.sessionKey] + "&openid=" + openid;
            }else{
                window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + localStorage[result.sessionKey] + "&openid=" + openid;
            }
            
        });

    })
    document.title = result.title
    if (!sessionStorage['jumped_to_card']) {
        //检查是否有历史卡券
        $.ajax({
            type: "POST",
            url: acmp_host + "prize/list",
            data: { 'openid': openid, 'activity_id': 1233},
            dataType: "json",
            success: function (data) {
                sessionStorage['jumped_to_card'] = 1;
                if (data.data.length == 0) {
                    return false;
                }
                let first_coupon = data.data[0];
                if (first_coupon.today != 1) {
                    return false;
                }
                let GetSelect = first_coupon.coupon_id
                if (
                    (first_coupon.coupon_id == 2021
                        || first_coupon.coupon_id == 2022
                        || first_coupon.coupon_id == 2023
                        || first_coupon.coupon_id == 2025
                    ) &&
                    first_coupon.consume_status != 10
                ) {
                    localStorage[result.sessionKey] = coupon_code = first_coupon.coupon_code;
                    if(GetSelect == 2021){
                        window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + localStorage[result.sessionKey] + "&openid=" + openid;
                    }else if(GetSelect == 2022){
                        window.location.href = coupon_bag_host + 'webcoupon_yo.html' + "?coupon_code=" + localStorage[result.sessionKey] + "&openid=" + openid;
                    }else{
                        window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + localStorage[result.sessionKey] + "&openid=" + openid;
                    }
                }
            }
        })
    }
    //点击分享后自动领券
    var fromShare = urlGet()['from']
    if(fromShare == "share" && sessionStorage['jumped_to_card']){
        var getData = {}
        getData.activity_item_id = 1732
        getData.openid = openid
        getData.activity_id = activity_id
        getData.store_code = store_code
        
        $.ajax({
            type: "POST",
            url: acmp_host + "prize/lottery",
            data: getData,
            dataType: "json",
            success: function (data) {
                $("#loadingToast").hide();
                if (data.return_code != 200) {
                    my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function () { });
                } else {
                    //获取奖品
                    GetSelect = data.data.coupon.id; //从后台拿数据
                    coupon_code = data.data.coupon_code;
                    localStorage[result.sessionKey] = coupon_code
                    console.log(coupon_code)
                    $("#item").attr("src","images/page2/yo.png")
                    $(".alertContent").show();
                }
            }
        });
    }
    // wx.ready(function () {
    //     wx.hideOptionMenu()
    // });
})


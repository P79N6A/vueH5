$.getJSON("config.json", function (result) {
    var my_url = getHTUrl()
    var acmp_host = my_url.acmp_host
    var coupon_bag_host = my_url.coupon_bag_host
    var turnplate = result.turnplate
    var prize_config = result.prize
    var openid = urlGet()['openid']

    $(document).ready(function () {
        $('body,html').height(document.body.clientHeight);
        $('.pointer').click(function () {
            if (turnplate.bRotate) return
            $("#loadingToast").show();
            var getData = {}
            activity_id = urlGet()['activity_id']

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
                        sessionStorage[result.sessionKey] = coupon_code;
                        prize_config.forEach(element => {
                            if (GetSelect == element.index) {
                                $(".tanchang").attr('src', element.src);
                                item = element.prize;
                            }
                        });

                        rotateFn(item, function () {
                            $(".alert").show()
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
        $(".tanchang").click(function (event) {
            $(".alert").hide()
            window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + sessionStorage[result.sessionKey] + "&openid=" + openid;
        });

    })
    document.title = result.title
    var insertImg = ""
    var insertCss = ""
    result.images.forEach((element) => {
        insertCss = ""
        for(item in element.css){
            insertCss += item+":"+element.css[item]+";"
        }
        insertImg += '<img src="'+element['src']+'" class="'+element['class']+'" style="'+insertCss+'" />'
    })
    $(insertImg).insertBefore(".start_circle")
    if (!sessionStorage['jumped_to_card']) {
        //检查是否有历史卡券
        $.ajax({
            type: "POST",
            url: acmp_host + "couponRecord/list",
            data: { 'akk_openid': openid, 'skip': 0, 'size': 1 },
            dataType: "json",
            success: function (data) {
                console.log(data)
                if (data.data.list.length == 0) {
                    return false;
                }
                sessionStorage['jumped_to_card'] = 1;
                let first_coupon = data.data.list[0];
                if (
                    (first_coupon.id == 1989
                        || first_coupon.id == 1990
                        || first_coupon.id == 1991
                        || first_coupon.id == 1992
                    ) &&
                    first_coupon.record_status != 'CONSUMED'
                ) {
                    coupon_code = first_coupon.coupon_code;
                    window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + openid;
                }
            }
        })
    }
})
wx.ready(function () {
    //隐藏右上角菜单禁用分享
    wx.hideOptionMenu()
});


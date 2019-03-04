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

    //绘制页面元素
    pages = result.pages;

    //实例化翻页功能
    $(function(){
        mySwiper = new Swiper ('.swiper-container', {
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


    });

    $(document).ready(function () {
        var disabled = 0;
        $("#loadingToast").show();
        $.ajax({
            type: "POST",
            url: acmp_host + "couponRecord/list",
            data: {'akk_openid':urlGet()['openid'], 'skip': 0, 'size' : 1},
            dataType: "json",
            success: function(data) {
                if(data.data.list.length == 0){
                    return false;
                }
                var first_coupon = data.data.list[0];
                if(
                    (first_coupon.id == 2050 || first_coupon.id == 2051) && 
                    first_coupon.today == 1
                ){
                    my_alert("confirm_error", "很遗憾", "此二维码已使用过", "每个二维码只能参与一次活动哦~", ["知道啦"], ["green"], function () { });
                    disabled = 1
                }
                $("#loadingToast").hide();
            }
        })
        if(localStorage.media_id){
            showPage(1, pages, mySwiper);
        }else{
            showPage(0, pages, mySwiper);
        }

        $("body>*").bind("click",function(){});
        $(document).on('click', '.closePage', function(){
            wx.ready(function(){
                wx.closeWindow();
            });
        });

        $('.getRed').click(function(){
            $('.getRed').hide();
            $('.getRed').after('<img src="images/alert/success.png" style="position: absolute;top: 45vw;width: 80vw;left: 10vw;" class="closePage">');
        });

        let GetSelect
        $('body,html').height(document.body.clientHeight);
        $(".uploader").click(function(){
            if(disabled == 1){
                return false;
            }
            //选择文件并上传
            wx.ready(function(){
                upload('img');
            });
        })
        $('.pointer').click(function () {
            if (turnplate.bRotate) return
            $("#loadingToast").show();
            let item = 1
            var getData = {}
            getData.openid = openid
            getData.activity_id = activity_id
            getData.store_code = urlGet()['store_code']
            getData.media_id = localStorage.media_id;
            
            $.ajax({
                type: "POST",
                url: acmp_host + "prize/lottery",
                data: getData,
                dataType: "json",
                success: function (data) {
                    $("#loadingToast").hide();
                    localStorage.media_id = 0;
                    if (data.return_code != 200) {
                        if (data.return_msg == "超出每人每天参与次数，欢迎明天继续参与") {
                            my_alert("confirm_error", "很遗憾", "超出每人每天参与次数", "欢迎明天继续参与", ["知道啦"], ["green"], function () { });
                        } else {
                            if (data.return_msg == '谢谢参与') {
                                $(".alert_gift_box").css({ "background-image": "url(images/alert/wallpaper.png)", "top": "5%" })
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

                        if(GetSelect == 2050){
                            rotateFn(1, function () {
                                $('.alertContent').show();
                            });
                        }else{
                            rotateFn(2, function () {
                                $('.alertContent1').show();
                            });
                        }
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

    })
    document.title = result.title
})

function showPage(page, pages, mySwiper){

    var i = page + 1;
    i = 'page' + i;
    //背景
    var page_class = '.' + i;
    if(pages[i].background.type == 'color'){
        $(page_class).css('background-color', pages[i].background.color)
    }

    //图标
    var images = pages[i].images;
    for(var k in images){
        //样式
        var css = '';
        for(var j in images[k].css){
            css += j + ':' + images[k].css[j] + ';';
        }

        //class
        var classes = '';
        if(images[k].class){
            for(var l in images[k].class){
                classes += images[k].class[l] + ' '
            }
        }
        var img = '<img src="'+images[k].src+'" style="'+css+'" class="'+classes+'"/>';
        $(page_class).append(img);

    }

    mySwiper.slideTo(page)
}

function upload(data) {

    $var_img = data;//selertor
    $var_input = $('#'+data+'_input'); //图片值 identify_img2_input

    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            //images.localId = res.localIds;
            localIds = res.localIds;  // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            document.getElementById($var_img).src = localIds;   //选择的图片 显示
            //必须做一下mediaId的设定，否则将会无法在安卓端得到微信上传功能的触发
            localId = localIds.toString();
          //在成功选择图片或拍照的时候 可以触发上传图片,
            wx.uploadImage({
                localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                 
                success: function (res) {
                    localStorage.media_id = res.serverId; // 返回图片的服务器端ID 
                    showPage(1, pages, mySwiper);
                    $('.turnplate').addClass('animated rotateIn');
                    $('.pointer').addClass('animated heartBeat delay-2s');
                },
                fail:function(res){
                    alert(res.errMsg);
                    // alert(JSON.stringify(res))
                }
            });

        }
    });
}
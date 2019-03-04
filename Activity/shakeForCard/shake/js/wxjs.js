    
    $.ajax({
        url: "http://ab.aikaka.com.cn/PublicService/Weixin/getJsSdkConfig.php",
        type: 'GET',
        data:{
            url:location.href.split('#')[0]
        },
        dataType: 'json',
        success : function(result){
            if(result.appId){
                wx.config({
                    debug: false,
                    appId: result.appId,
                    timestamp: result.timestamp,
                    nonceStr: result.nonceStr,
                    signature: result.signature,
                    jsApiList: [
                        'hideOptionMenu',
                        'openCard',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'hideMenuItems'
                    ]
                });
                wx.ready(function () {
                    // 分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: '超市发双榆树店双11优惠大放送', // 分享标题
                        link: 'http://ab.aikaka.com.cn/shakeApp/shakeForCard/shake/chaoshifa?entry=share', // 分享链接
                        imgUrl: 'http://ab.aikaka.com.cn/shakeApp/shakeForCard/shake/img/csf_logo.png', // 分享图标
                        success: function () { 
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () { 
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    // 分享给朋友
                    wx.onMenuShareAppMessage({
                        title: '超市发双榆树店双11优惠大放送', // 分享标题
                        desc: '有优惠不孤单', // 分享描述
                        link: 'http://ab.aikaka.com.cn/shakeApp/shakeForCard/shake/chaoshifa?entry=share', // 分享链接
                        imgUrl: 'http://ab.aikaka.com.cn/shakeApp/shakeForCard/shake/img/csf_logo.png', // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () { 
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () { 
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    //禁止复制链接
                    wx.hideMenuItems({
                        menuList:[
                            'menuItem:copyUrl'
                        ]
                    });
                });
            }else{
                alert("数据读取错误！");
            }
        },
        error:function(xhs){
            //alert(xhs.responseText);
        }
    });






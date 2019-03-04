$(document).ready(function () {
var getCoupon = {};
getCoupon.activity_id = urlGet()['activity_id'];
getCoupon.openid = urlGet()['openid'];
var getdata={};
getdata.akk_openid=urlGet()['openid'];
getdata.activity_id=urlGet()['activity_id'];
var getGift={};
getGift.activity_id = urlGet()['activity_id'];
getGift.openid = urlGet()['openid'];
localStorage.setItem('unionid', urlGet()['unionid']);
localStorage.setItem('activity_id', urlGet()['activity_id']);
var d = new Date();
var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
if (localStorage[str]) {
    $.ajax({
            type: "POST",
            url: acmp_host + "couponRecord/list",
            data: getdata,
            dataType: "json",
            success: function(data) {
                if (data.return_code != 200) {
                    my_alert("confirm_error", "很遗憾",data.return_msg,"",["知道啦"],["#000000"],function(){})
                } else {
                    
                    if(localStorage.move=="2"){
                        window.location.href ="index.html?activity_id="+urlGet()['activity_id']+"&openid="+urlGet()['openid']+"&activity_item_id="+move_item_id;
                    }else{
                        if(data.data.list.length>0){
                             if(data.data.list[0].record_status=="CONSUMED"){
                                my_alert("confirm_error", "很遗憾","您已经参与过今天的活动","欢迎下次再来",["知道啦"],["#000000"],function(){
                                   WeixinJSBridge.call('closeWindow');
                                })
                            }else if(data.data.list[0].record_status=="APPLIED"){
                                if(data.data.list[0].title==coupon_title){
                                     window.location.href = coupon_bag_host+"webcoupon.html?coupon_code="+data.data.list[0].coupon_code;
                                }else if(data.data.list[0].title==move_title){
                                     my_alert("confirm_error", "很遗憾","您已经参与过今天的活动","欢迎下次再来",["知道啦"],["#000000"],function(){
                                        WeixinJSBridge.call('closeWindow');
                                     })  
                                }
                                
                            }
                        }
                    }
                }
            },
            error: function(data) { 
                  my_alert("confirm_error", "加载失败","网络出现问题啦，","请再试试吧！",["知道啦"],["#000000"],function(){
                        WeixinJSBridge.call('closeWindow');
                  });
            }
    });     
} else {
    $.ajax({
            type: "POST",
            url: acmp_host + "shakeFor/lottery",
            data: getCoupon,
            dataType: "json",
            success: function(data) {
                if (data.return_code != 200) {
                    my_alert("confirm_error", "领取失败",data.return_msg,"",["知道啦"],["#000000"],function(){})
                } else {
                    localStorage.setItem(str, 1);
                    if(data.data.activity_item_id==coupon_item_id){
                         getGift.activity_item_id=data.data.activity_item_id;
                         $.ajax({
                                type: "POST",
                                url: acmp_host + "shakeFor/gift",
                                data: getGift,
                                dataType: "json",
                                success: function(data) {
                                    if (data.return_code != 200) {
                                        my_alert("confirm_error", "领取失败",data.return_msg,"",["知道啦"],["#000000"],function(){})
                                    } else {
                                        window.location.href = coupon_bag_host+"webcoupon.html?coupon_code="+data.data.coupon_code;
                                    }
                                },
                                error: function(data) { 
                                      my_alert("confirm_error", "加载失败","网络出现问题啦，","请再试试吧！",["知道啦"],["#000000"],function(){
                                            WeixinJSBridge.call('closeWindow');
                                      });
                                }
                          });
                    }else if(data.data.activity_item_id==move_item_id){
                         localStorage.setItem('move', "2");
                       window.location.href ="index.html?activity_id="+urlGet()['activity_id']+"&openid="+urlGet()['openid']+"&activity_item_id="+data.data.activity_item_id;
                    }
                }
            },
            error: function(data) { 
                  my_alert("confirm_error", "加载失败","网络出现问题啦，","请再试试吧！",["知道啦"],["#000000"],function(){
                        WeixinJSBridge.call('closeWindow');
                  })
            }

    });   
}
})

      
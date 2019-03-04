var this_url = window.location.href;
if ($.trim(this_url).substr(0, 9) == "http://ab") {
    var acmp_host = 'http://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    var coupon_bag_host = 'http://ab.aikaka.com.cn/AcmpCola/CouponBagV2/';
} else if ($.trim(this_url).substr(0, 11) == "http://acmp") {
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
}

var turnplate = {
    restaraunts: [], //大转盘奖品名称
    colors: [], //大转盘奖品区块对应背景颜色
    outsideRadius: 192, //大转盘外圆的半径
    textRadius: 155, //大转盘奖品位置距离圆心的距离
    insideRadius: 68, //大转盘内圆的半径
    startAngle: 0, //开始角度
    bRotate: false //false:停止;ture:旋转
};
var selected = "";
var openid, third_party_openid, activity_id, coupon_code, GetSelect;
activity_id = urlGet()['activity_id'];
third_party_openid = urlGet()['cola_openid'];
var textFont = ["#000000", "#176bfa", "#000000", "#176bfa", "#000000", "#176bfa"];
openid = urlGet()['openid'];
if (typeof(third_party_openid) == "undefined") {
    var _url = "http://kele.keliaier.com/h5/keleuserintf.jspx?callback_url=" + encodeURIComponent(this_url);
    window.location.href = _url;
} else {
    document.write("<script src='http://ab.aikaka.com.cn/PublicService/Weixin/js/wxjspsdk.js'>" + "<" + "/script>");
}
$(document).ready(function() {
    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.restaraunts = ["用车券礼包", "微鲸电视", "用车券礼包", "微鲸电视", "用车券礼包", "微鲸电视"];
    turnplate.colors = ["#f8c82d", "#fad931", "#f8c82d", "#fad931", "#f8c82d", "#fad931"];
    var rotateTimeOut = function() {
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: 2160,
            duration: 8000,
            callback: function() {
                alert('网络超时，请检查您的网络设置！');
            }
        });
    };

    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function(item, onFinish) {
        var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length * 2));
        if (angles < 270) {
            angles = 270 - angles;
        } else {
            angles = 360 - angles + 270;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: angles + 1800,
            duration: 8000,
            callback: function() {
                turnplate.bRotate = !turnplate.bRotate;
                onFinish();
            }
        });
    };
    $('.pointer').click(function() {
        if (turnplate.bRotate) return
        $("#loadingToast").show();
        var getData = {}
        getData.openid = openid;
        getData.activity_id = activity_id;
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
                    turnplate.bRotate = !turnplate.bRotate;
                    //获取奖品
                    GetSelect = data.data.coupon.title; //从后台拿数据
                    coupon_code = data.data.coupon_code;
                    if (GetSelect == "ofo优惠券" || GetSelect.indexOf("优惠券") > 0) {
                        selected = "用车券礼包"
                    } else if (GetSelect == "微鲸智能电视机" || GetSelect.indexOf("微鲸智能") > 0) {
                        selected = "微鲸电视"
                    } else {
                        return false
                    }
                    var item = turnplate.restaraunts.indexOf(selected) + 1;
                    if (item == "1") {
                        // 核销掉卡券
                        $.ajax({
                            type: "POST",
                            url: acmp_host + "consume/scrape",
                            data: {
                                coupon_code: coupon_code
                            },
                            success: function(data) {

                            }
                        })
                        $(".get_coupon").css("bottom","24.44%");
                        $(".alert_gift_box").css({ "background-image": "url(images/car_show.png)", "top": "5%" });
                        var random = Math.floor(Math.random() * 3 + 1);
                        if (random == "1") { item = "1"; } else if (random == "2") { item = "3"; } else if (random == "3") { item = "5"; };
                    } else if (item == "2") {
                        $(".get_coupon").css("bottom","16.44%");
                        $(".alert_gift_box").css({ "background-image": "url(images/tv_show.png)", "top": "5%" })
                        var random = Math.floor(Math.random() * 3 + 1);
                        if (random == "1") { item = "2"; } else if (random == "2") { item = "4"; } else if (random == "3") { item = "6"; };
                    }
                    rotateFn(item, function() {
                        $(".show_box").show();
                    });
                }
            },
            error: function() {
                $("#loadingToast").hide();
                my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
            }
        });


    });
});

//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload = function() {
    drawRouletteWheel(textFont);
};
// 点击跳到卡包
$(".get_coupon").click(function(event) {
    if (coupon_code && selected == "微鲸电视") {
        if (urlGet()['substribe'] == 1) {
            window.location.href = coupon_bag_host + 'webcouponshow_qr.html' + "?coupon_code=" + coupon_code + "&openid=" + urlGet()['openid'];
        } else {
            window.location.href = "http://mp.weixin.qq.com/s/9wcSAnqW4TiPJ6t7jC0muA";
        }
    } else {
        window.location.href = "http://common.ofo.so/campaign/161105/?utm_source=954_1491557033558";
    }

});

function drawRouletteWheel(textFont) {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length / 2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 422, 422);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
        ctx.strokeStyle = "#ffffff";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = 'bold 24px Microsoft YaHei';
        for (var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
            ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //----绘制奖品开始----
            ctx.fillStyle = textFont[i];
            var text = turnplate.restaraunts[i];
            var line_height = 34;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            if (text.length > 5) { //奖品名称长度超过一定范围 
                text = text.substring(0, 5) + "||" + text.substring(5, 9) + "||" + text.substring(9);
                var texts = text.split("||");
                for (var j = 0; j < texts.length; j++) {
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            } else {
                //在画布上绘制填色的文本。文本的默认颜色是黑色
                //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }
            if (text.indexOf("用车") !== -1) {
                var img1 = document.getElementById("shan-img1");
                img1.onload = function() {
                    ctx.drawImage(img, -10, -20);
                };
                ctx.drawImage(img1, -24, 10);
            } else if (text.indexOf("微鲸") !== -1) {
                var img1 = document.getElementById("shan-img2");
                img1.onload = function() {
                    ctx.drawImage(img, -60, -20);
                };
                ctx.drawImage(img1, -20, 10);
            }
            //把当前画布返回（调整）到上一个save()状态之前 
            ctx.restore();
            //----绘制奖品结束----
        }
    }
}

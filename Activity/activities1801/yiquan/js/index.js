var this_url = window.location.href;
if ($.trim(this_url).substr(0, 9) == "http://ab") {
    var acmp_host = 'http://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    var coupon_bag_host = 'http://ab.aikaka.com.cn/AcmpCola/CouponBagV2/';
} else if ($.trim(this_url).substr(0, 11) == "http://acmp") {
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
}

// 存次数
var d = new Date();
var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + openid + activity_id;
if (localStorage[str]) {
    if (localStorage[str] <= 0) {
        $('.limit_times').html(0);
    } else {
        $('.limit_times').html(localStorage[str]);
    }
} else {
    localStorage[str] = 3;
    $('.limit_times').html(localStorage[str]);
}

var turnplate = {
    restaraunts: [], //大转盘奖品名称
    colors: [], //大转盘奖品区块对应背景颜色
    outsideRadius: 185, //大转盘外圆的半径
    textRadius: 155, //大转盘奖品位置距离圆心的距离
    insideRadius: 68, //大转盘内圆的半径
    startAngle: 0, //开始角度
    bRotate: false //false:停止;ture:旋转
};
var selected = "";
var openid, activity_id, coupon_code, GetSelect;
activity_id = urlGet()['activity_id'];
var textFont = ["#ffffff", "#000000", "#ffffff", "#000000", "#ffffff", "#000000"];
openid = urlGet()['openid'];

$(document).ready(function() {
    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.restaraunts = ["谢谢参与", "怡泉精美礼品||1份", "谢谢参与", "淘票票优惠券||1张", "谢谢参与", "情侣双人定制罐||1套"];
    turnplate.colors = ["#e7a44c", "#fdf151", "#e7a44c", "#fdf151", "#e7a44c", "#fdf151"];

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
                var lift_time = localStorage[str];
                lift_time--;
                localStorage[str] = lift_time;

                if (data.return_code != 200) {
                    if (data.return_msg == "超出每人每天参与次数，欢迎明天继续参与") {
                        my_alert("confirm_error", "很遗憾", "超出每人每天参与次数", "欢迎明天继续参与", ["知道啦"], ["green"], function() {});
                    } else {
                        if(data.return_msg == '谢谢参与'){
                            $(".alert_gift_box").css({ "background-image": "url(images/alert_sorry.png)", "top": "35%" })
                            item = 1
                            rotateFn(item, function() {
                                $(".show_box").show();
                            });
                        }else{
                            my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function() {});
                        }
                    };
                } else {
                    turnplate.bRotate = !turnplate.bRotate;
                    //获取奖品
                    GetSelect = data.data.coupon.title; //从后台拿数据
                    coupon_code = data.data.coupon_code;
                    if (GetSelect.indexOf("精美") > 0) {
                        $(".alert_gift_box").css({ "background-image": "url(images/alert_gift.png)", "top": "35%" });
                        item = 2;
                    } else if (GetSelect.indexOf("票票") > 0) {
                        $(".alert_gift_box").css({ "background-image": "url(images/alert_piao.png)", "top": "35%" })
                        item = 4
                    } else if (GetSelect.indexOf("罐") > 0) {
                        $(".alert_gift_box").css({ "background-image": "url(images/alert_guan.png)", "top": "35%" })
                        item = 6
                    } else {
                        return false
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
// 点击跳到卡券页
$(".alert_gift_box").click(function(event) {
    if(item == 1){
        location.reload();
    }else if (item == 2) {
        window.location.href = coupon_bag_host + 'webcoupon.html' + "?coupon_code=" + coupon_code + "&openid=" + urlGet()['openid'];
    }
    else{
        window.location.href = coupon_bag_host + 'webcouponthird_party.html' + "?coupon_code=" + coupon_code + "&openid=" + urlGet()['openid'];
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
        ctx.font = 'bold 20px Microsoft YaHei';
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
            var line_height = 24;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/ 
            // text = text.substring(0, 6) + "||" + text.substring(6, 9) + "||" + text.substring(9);
            var texts = text.split("||");
            for (var j = 0; j < texts.length; j++) {
                ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height + 20);
            }
            if (i == 0 || i == 2 || i == 4 || i == 6) {
                var img1 = document.getElementById("shan-img1");
                img1.onload = function() {
                    ctx.drawImage(img, -10, -20);
                };
                ctx.drawImage(img1, -24, 10);
            } else if (i == 1 || i == 3 || i == 5 || i == 7) {
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
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
    outsideRadius: 190, //大转盘外圆的半径
    textRadius: 154, //大转盘奖品位置距离圆心的距离
    insideRadius: 70, //大转盘内圆的半径
    startAngle: 0, //开始角度
    bRotate: false //false:停止;ture:旋转
};
var selected = "";
var openid, activity_id, coupon_code, GetSelect;
activity_id = urlGet()['activity_id'];
var textFont = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"];
openid = urlGet()['openid'];

$(document).ready(function() {
    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.restaraunts = ["谢谢参与", "漫威主题||人物玩具1个", "零度可口可乐||漫威主题纪念罐1罐", "谢谢参与", "漫威主题||人物玩具1个", "零度可口可乐||漫威主题纪念罐1罐"];
    turnplate.colors = ["#e0041d", "#ea6104", "#e0041d", "#ea6104", "#e0041d", "#ea6104"];

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
                            $(".alert_gift_box").css({ "background-image": "url(images/xiexie.png)", "top": "5%" })
                            item = 4
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
                    if (GetSelect.indexOf("主题人物玩具一个") > 0) {
                        $(".alert_gift_box").css({ "background-image": "url(images/yideng.png)", "top": "5%" });
                        item = 2;
                    } else if (GetSelect.indexOf("主题纪念罐一罐") > 0) {
                        $(".alert_gift_box").css({ "background-image": "url(images/erdeng.png)", "top": "5%" })
                        item = 3;
                    } else {
                        $(".alert_gift_box").css({ "background-image": "url(images/xiexie.png)", "top": "5%" })
                        item = 4;
                    }
                    rotateFn(item, function() {
                        $(".show_box").show();
                    });
                }
            },
            error: function() {
                $(".alert_gift_box").css({ "background-image": "url(images/xiexie.png)", "top": "5%" })
                item = 4;
                rotateFn(item, function() {
                    $(".show_box").show();
                });
                //my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
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
    if(item == 4){
        location.reload();
    }else{
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
        ctx.font = 'bold 16px Microsoft YaHei';
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
            if (text.length > 6) { //奖品名称长度超过一定范围 
                // text = text.substring(0, 6) + "||" + text.substring(6, 9) + "||" + text.substring(9);
                var texts = text.split("||");
                for (var j = 0; j < texts.length; j++) {
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            } else {
                //在画布上绘制填色的文本。文本的默认颜色是黑色
                //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
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

//转盘宽高相等
$(function(){
    var w = $('.banner .turnplate').css('width');
    w = parseInt(parseInt(w) / 2) * 2;
    $('.banner .turnplate').css('width', w + 'px');
    $('.banner .turnplate').css('height', w + 'px');
});
var this_url = window.location.href;
if ($.trim(this_url).substr(0, 9) == "http://ab") {
    var acmp_host = 'http://ab.aikaka.com.cn/AcmpCola/AcmpApi/';
    var coupon_bag_host = 'http://ab.aikaka.com.cn/AcmpCola/CouponBagV2/';
    var first_item = "1269";
    var activity_id = 1010;
} else if ($.trim(this_url).substr(0, 11) == "http://acmp") {
    var acmp_host = 'http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/';
    var coupon_bag_host = 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/';
    var first_item = "1289";
    var activity_id = 1017;
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

var img_box = [
    { "img_name": "500ml樱桃可乐免费领", "img_src": "free" },
    { "img_name": "泰国香水椰青优惠券", "img_src": "zd_mj" },
    { "img_name": "小乐西瓜优惠券", "img_src": "zd_yt" },
    { "img_name": "生态番茄优惠券", "img_src": "zd_fl" },
    { "img_name": "Gofun 出行优惠券", "img_src": "gf" },
];
var now_img, select, openid, times_limit, just_first, entry, store_name, third_party_openid;
entry = urlGet()['entry'];
store_name = "A";
third_party_openid = urlGet()['third_party_openid'];
var textFont = ["#f9c911", "#ffffff", "#f9c911", "#ffffff", "#f9c911", "#ffffff"];
openid = urlGet()['openid'];
if (typeof(openid) == "undefined") {
    var _url = "http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=" + encodeURIComponent(this_url);
    window.location.href = _url;
} else if (typeof(third_party_openid) == "undefined") {
    var new_url = "http://ab.aikaka.com.cn/PublicService/Weixin/oauth/base?app_id=wxbd1b32f7dd733666&callback_url=" + encodeURIComponent(this_url);
    window.location.href = new_url;
} else {
    document.write("<script src='http://ab.aikaka.com.cn/PublicService/Weixin/js/wxjspsdk.js'>" + "<" + "/script>");
    // 统计是从哪里参与的活动
    $.ajax({
        type: "GET",
        url: acmp_host + "weixin/playingActivity?kkh_openid=" + third_party_openid,
        async: false,
        success: function(data) {
            $("#loadingToast").hide();
            if (data.return_code != 200) {
                // my_alert("confirm_error", "很遗憾", data.return_msg, "", ["知道啦"], ["green"], function() {});
            } else {
                var sign = data.data.sign;
                if (sign == "COLA-B") {
                    store_name = "B";
                } else {
                    store_name = "A";
                }
            }
        },
        error: function() {
            $("#loadingToast").hide();
            my_alert("confirm_error", "加载失败", "网络出小差啦", "请再试试吧！", ["知道啦"], ["green"], function() {})
        }
    });
    var originData = {};
    originData.akk_openid = urlGet()['openid'];
    originData.activity_id = activity_id;
    originData.store_name = store_name;
    if (entry) {
        originData.entry = entry;
    } else {
        originData.entry = 'BUTTON';
    }
    $.ajax({
        type: "POST",
        url: acmp_host + "shakeFor/join",
        dataType: "json",
        data: originData,
        success: function(data) {}
    });
    // 判断是否参与过活动
    var getdata_list = {};
    getdata_list.akk_openid = openid;
    getdata_list.activity_id = activity_id;
    $.ajax({
        type: "POST",
        url: acmp_host + "couponRecord/list",
        dataType: "json",
        async: false,
        data: getdata_list,
        success: function(data) {
            if (data.return_code == 200) {
                if (data.data.list.length > 0) {
                    just_first = 0
                } else {
                    just_first = 1
                }
            }
        }
    });
}
$(document).ready(function() {
    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.restaraunts = ["樱桃味可口可乐", "真的有料水果礼券", "Gofun共享汽车", "樱桃味可口可乐", "真的有料水果礼券", "Gofun共享汽车"];
    turnplate.colors = ["#cd2525", "#f9c911", "#cd2525", "#f9c911", "#cd2525", "#f9c911"];
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
    // 获取积分
    var score_data = {};
    score_data.openid = urlGet()['openid'];
    $.ajax({
        type: "POST",
        url: acmp_host + "score/total",
        dataType: "json",
        async: false,
        data: score_data,
        success: function(data) {
            if (data.return_code == 200) {
                times_limit = parseInt(data.data.score / 3)
                $(".times").html(times_limit);
                $(".count").html(data.data.score);
            }
        }
    });

    $('.pointer').click(function() {
        if (times_limit <= 0) {
            my_alert("confirm_error", "很遗憾", "抽奖积分不足", "欢迎下次继续参与", ["知道啦"], ["green"], function() {});
            return false
        }
        if (turnplate.bRotate) return
        var selected = "";
        $("#loadingToast").show();
        var getData = {}
        getData.openid = openid;
        getData.activity_id = activity_id;
        if (just_first) {
            getData.activity_item_id = first_item;
        }
        $.ajax({
            type: "POST",
            url: acmp_host + "shakeFor/drawWithScore",
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
                    
                    //获取奖品
                    GetSelect = data.data.coupon.title; //从后台拿数据
                    for (var i = 0; i < img_box.length; i++) {
                        if (GetSelect == img_box[i].img_name) {
                            now_img = img_box[i].img_src;
                        }
                    }
                    if (GetSelect.indexOf("出行优惠券") > 0) {
                        now_img = "gf";
                    }
                    if (GetSelect == "500ml樱桃可乐免费领") {
                        selected = "樱桃味可口可乐"
                    } else if (GetSelect == "泰国香水椰青优惠券" || GetSelect == "小乐西瓜优惠券" || GetSelect == "生态番茄优惠券") {
                        selected = "真的有料水果礼券"
                    } else if (GetSelect.indexOf("出行优惠券") > 0) {
                        selected = "Gofun共享汽车"
                    } else {
                        return false
                    }
                    var item = turnplate.restaraunts.indexOf(selected) + 1;
                    if (item == "1") {
                        var random = Math.floor(Math.random() * 2 + 1);
                        if (random == "1") { item = "1"; } else { item = "4"; };
                    }
                    if (item == "2") {
                        var random = Math.floor(Math.random() * 2 + 1);
                        if (random == "1") { item = "2"; } else { item = "5"; };
                    }
                    if (item == "3") {
                        var random = Math.floor(Math.random() * 2 + 1);
                        if (random == "1") { item = "3"; } else { item = "6"; };
                    }
                    turnplate.bRotate = !turnplate.bRotate;
                    rotateFn(item, function() {
                        $(".coupon_img").attr("src", "images/" + now_img + ".png");
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
    window.location.href = coupon_bag_host + 'webcoupon_list.html' + "?activity_id=" + activity_id + "&openid=" + openid;
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
            if (text.indexOf("优惠") > 0) {
                var texts = text.split("优惠");
                for (var j = 0; j < texts.length; j++) {
                    ctx.font = j == 0 ? 'bold 24px Microsoft YaHei' : 'bold 24px Microsoft YaHei';
                    if (j == 0) {
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                        ctx.fillStyle = textFont[i];
                    } else {
                        ctx.fillText("优惠" + texts[j], -ctx.measureText("优惠" + texts[j]).width / 2, j * line_height);
                        ctx.fillStyle = textFont[i];
                    }
                }
            } else if (text.indexOf("共享") > 0) {
                var texts = text.split("共享");
                for (var j = 0; j < texts.length; j++) {
                    ctx.font = j == 0 ? 'bold 24px Microsoft YaHei' : 'bold 24px Microsoft YaHei';
                    if (j == 0) {
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                        ctx.fillStyle = textFont[i];
                    } else {
                        ctx.fillText("共享" + texts[j], -ctx.measureText("共享" + texts[j]).width / 2, j * line_height);
                        ctx.fillStyle = textFont[i];
                    }
                }
            } else if (text.indexOf("可口可乐") > 0) {
                var texts = text.split("可口可乐");
                for (var j = 0; j < texts.length; j++) {
                    ctx.font = j == 0 ? 'bold 24px Microsoft YaHei' : 'bold 24px Microsoft YaHei';
                    if (j == 0) {
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                        ctx.fillStyle = textFont[i];
                    } else {
                        ctx.fillText("可口可乐" + texts[j], -ctx.measureText("可口可乐" + texts[j]).width / 2, j * line_height);
                        ctx.fillStyle = textFont[i];
                    }
                }
            } else if (text.length > 4) { //奖品名称长度超过一定范围 
                text = text.substring(0, 4) + "||" + text.substring(4, 8) + "||" + text.substring(8);
                var texts = text.split("||");
                for (var j = 0; j < texts.length; j++) {
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            } else {
                //在画布上绘制填色的文本。文本的默认颜色是黑色
                //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }


            //把当前画布返回（调整）到上一个save()状态之前 
            ctx.restore();
            //----绘制奖品结束----
        }
    }
}

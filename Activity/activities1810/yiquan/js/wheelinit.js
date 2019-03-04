var rotateFn,readys = false
    $(document).ready(function(result) {
$.getJSON("config.json", function (result){


        var w = $('body').css('width');
        var ruler = (parseInt(w)*0.01)
        $('.start_circle').css('left', ruler * 11 + 'px')
        $('.start_circle').css('width', ruler * 80 + 'px')
        $('.start_circle').css('height', ruler * 80 + 'px')
        $('.start_circle .item').css('left', ruler * 5 + 'px')
        $('.start_circle .item').css('top', ruler * 5 + 'px')
        $('.start_circle .item').css('width', ruler * 70 + 'px')
        $('.start_circle .item').css('height', ruler * 70 + 'px')

        turnplate = result.turnplate
        console.log(turnplate)
        $('.pointer').attr('src', turnplate.pointer);
        $('.turnplate').css('background-image', 'url('+turnplate.turnplate+')');

        var selected = "";
        var openid, activity_id, coupon_code, GetSelect;
        activity_id = urlGet()['activity_id'];
        openid = urlGet()['openid'];

        //旋转转盘 item:奖品位置; txt：提示语;
            rotateFn = function(item, onFinish) {
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
        
    });

    //页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
    window.onload = function() {
        drawRouletteWheel();
        readys = true
    };
    function drawRouletteWheel() {
        var canvas = document.getElementById("wheelcanvas");
        var cslength = turnplate.canvasLength;
        if (canvas.getContext) {
            //根据奖品个数计算圆周角度
            var arc = Math.PI / (turnplate.restaraunts.length / 2);
            var ctx = canvas.getContext("2d");
            //在给定矩形内清空一个矩形
            ctx.clearRect(0, 0, cslength, cslength);
            //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
            ctx.strokeStyle = "#ffffff";
            //font 属性设置或返回画布上文本内容的当前字体属性
            
            for (var i = 0; i < turnplate.restaraunts.length; i++) {
                ctx.font = turnplate.fontSize[i];
                var angle = turnplate.startAngle + i * arc;
                ctx.fillStyle = turnplate.colors[i];
                ctx.beginPath();
                //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
                ctx.arc(cslength/2, cslength/2, turnplate.outsideRadius, angle, angle + arc, false);
                ctx.arc(cslength/2, cslength/2, turnplate.insideRadius, angle + arc, angle, true);
                ctx.stroke();
                ctx.fill();
                //锁画布(为了保存之前的画布状态)
                ctx.save();

                //----绘制奖品开始----
                let lineColor = turnplate.fontColor[i].split("||")
                ctx.fillStyle = lineColor[0];
                var text = turnplate.restaraunts[i];
                var line_height = 24;
                //translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(cslength/2 + Math.cos(angle + arc / 2) * turnplate.textRadius, cslength/2 + Math.sin(angle + arc / 2) * turnplate.textRadius);

                //rotate方法旋转当前的绘图
                ctx.rotate(angle + arc / 2 + Math.PI / 2);

                /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
                if (text.length > 4) { //奖品名称长度超过一定范围 
                    // text = text.substring(0, 6) + "||" + text.substring(6, 9) + "||" + text.substring(9);
                    var texts = text.split("||");
                    for (var j = 0; j < texts.length; j++) {
                        if(j>0){
                            ctx.fillStyle = lineColor[1]
                        }
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                    }

                } else {
                    //在画布上绘制填色的文本。文本的默认颜色是黑色
                    //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                }
                // if (i == 0 || i == 2 || i == 4 || i == 6) {
                //     var img1 = document.getElementById("shan-img1");
                //     img1.onload = function() {
                //         ctx.drawImage(img, -10, -20);
                //     };
                //     ctx.drawImage(img1, -24, 10);
                // } else if (i == 1 || i == 3 || i == 5 || i == 7) {
                //     var img1 = document.getElementById("shan-img2");
                //     img1.onload = function() {
                //         ctx.drawImage(img, -60, -20);
                //     };
                //     ctx.drawImage(img1, -20, 10);
                // }
                //把当前画布返回（调整）到上一个save()状态之前 
                ctx.restore();
                //----绘制奖品结束----
            }
        }
    }
    
    //转盘宽高相等
    // $(function(){
    //     var w = $('.banner').css('width');
    //     w = parseInt(parseInt(w) / 2) * 2;
    //     $('.banner').css('width', w + 'px');
    //     $('.banner').css('height', w + 'px');
    //     $('.turnplate').css(result.trunplateCss);
    // });

    //由内而外计算
    
})
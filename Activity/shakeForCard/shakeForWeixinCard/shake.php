<!DOCTYPE html>
<?php
    if(true||isset($_GET['page_id']) && 
        isset($_GET['openid']) && 
        isset($_GET['user_id']) 
    ){
        $page_id = 33;//$_GET['page_id'];
        $open_id = $_GET['openid'];
        $user_id = 5;//$_GET['user_id'];
        $activity_id = 21;

    }else{
        die('param invalid');
    }
?>

<html>
    <head>
        <title>欢迎Deby光临爱咔咔</title>
        <meta charset="utf-8">
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <link rel="stylesheet" href="css/global.css" media="screen" title="no title" charset="utf-8">
        <link rel="stylesheet" href="css/master.css" media="screen" title="no title" charset="utf-8">
        <link rel="stylesheet" href="css/animate.css">
        <meta name="viewport" content="width = device-width,target-densitydpi = high-dpi,initial-scale = 1.0,maxium = 1.0,user-scalable = no">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        
    </head>
    <body>
        <div id="wrap">
            <div class="title">
                <p>欢迎Deby光临爱咔咔</p>
                <h4>摇一摇赢奖品</h4>
            </div>
            <div id="shake">
                <img src="img/shake-phone.png" id="shake-main" style = "width:60%;" class = "animated wobble">
          </div>
            <div>
                <h3 id="last">摇一摇，有惊喜</h3>
            </div>
            <div id="float"></div>
        </div>
        <script type="text/javascript" src="js/zepto.min.js"></script>
        <script src="js/shake.js"></script>
        <script type="text/javascript">
            //onload
            window.onload = function(){
                fitsize();

                //预加摇一摇声音
                var shakeAudio = new Audio();
                    shakeAudio.src = 'sound/shake_sound.mp3';
                var shake_options = {
                    preload  : 'auto'
                }
                for(var key in shake_options){
                    if(shake_options.hasOwnProperty(key) && (key in shakeAudio)){
                        shakeAudio[key] = shake_options[key];
                    }
                }

                //监听摇一摇事件
                var myShakeEvent = new Shake({
                    threshold: 10
                });                       
                myShakeEvent.start();

                window.addEventListener('shake', shakeEventDidOccur, false);
                window.addEventListener('shake',function(){
                    setTimeout(function(){
                        readyFunc();
                    },500);
                },false);

                //摇一摇效果
                function shakeEventDidOccur () {                 
                    var shakeImg = document.getElementById("shake-main");   
                    shake.innerHTML = '<img src="img/shake-phone.png" style = "width:60%" id="shake-main">';
                    shake.innerHTML = '<img src="img/shake-phone.png" style = "width:60%" id="shake-main" class= "animated wobble">';
                    shakeAudio.play();
                    var result = document.getElementById("last");
                    var arr = ['加油还有更多优惠哟！ ','胳膊酸了就呆会再摇！','惊喜大奖等你拿！'];
                    var num = Math.floor(Math.random()*3);
                    result.innerHTML = arr[num]+"!";
                    
                }       
                //function for getting card
                var readyFunc = function onBridgeReady() {
                    var page_id = "<?php echo $page_id; ?>";
                    var openid = "<?php echo $open_id; ?>";
                    var user_id = "<?php echo $user_id; ?>";
                    var activity_id = "<?php echo $activity_id; ?>";
                    $.ajax({
                        url : "/shake/shakeForWeixinCard/getCoupon",
                        data:{
                            page_id: page_id,
                            openid: openid,
                            user_id: user_id,
                            activity_id: activity_id
                        },
                        type : "GET",
                        async:false,
                        dataType : 'json',
                        error:function(){
                            alert("接口调用异常");
                        },
                        success : function (result){
                            if(result.errCode == 0){
                                WeixinJSBridge.invoke('batchAddCard', {
                                    "card_list": [
                                        {
                                            "card_id": result.card_id,
                                            "card_ext": "{\"code\":\"\",\"openid\":\"\",\"timestamp\":\""+result.begin_timestamp+"\",\"signature\":\""+result.signature+"\"}"
                                        }
                                    ]
                                    },
                                    function(res){
                                        //alert(JSON.stringify(res));
                                        if(res.err_msg.indexOf("batch_add_card")==-1){  //微信有时会拒绝请求，返回access denied
                                            alert("获取卡券失败，请关闭摇一摇界面重试！");
                                        }else{
                                            //添加用户查看卡券的记录
                                            $.ajax({
                                                url : "/shake/shakeForWeixinCard/setVisitRecord",
                                                data:{
                                                    user_id: openid,
                                                    card_id: result.card_id
                                                },
                                                type : "POST",
                                                dataType : 'json'
                                            });
                                        }
                                    }
                                );
                            }else{
                                window.location.href = "over.html?errCode="+result.errCode;
                            }
                        }
                    });
                }
                //readyFunc();
            }
            //resize
            window.onresize = function(){
                 fitsize();
            };

             //尺寸适配
             function fitsize(){
                screenHeight = $(window).height();
                cardHeight = screenHeight*0.8;
                imgHeight = screenHeight*0.4;
                $("#wrap").css("height", $(window).height());
                $('#card-main').css('height',cardHeight);
                $('img').css('max-height',imgHeight);
             }
        </script>
    </body>
</html>

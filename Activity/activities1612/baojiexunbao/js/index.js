    $(function() {
        if (sessionStorage.yesORno) {
            light();
        } else {
            var beacons1 = [10026, 583];
            var beacons2 = [10026, 585];
            var beacons3 = [10026, 586];
            var beacons4 = [10011, 52255];
            var times = 0;
            var ok = false;

            wx.ready(function() {
                $("#loadingToast").show();
                wx.startSearchBeacons({
                    ticket: urlGet()['ticket'],
                    complete: function(argv) {
                        if (argv.errMsg == "startSearchBeacons:location service disable") {
                            // alert("地理位置服务未打开");
                            // WeixinJSBridge.call('closeWindow');

                            var dat = {
                                type: "confirm_error",
                                // type:"select",
                                text: "手机地理位置服务未打开",
                                inte: "",
                                desc: "",
                                imgsrc: "img/err.png",
                                btn_text: ["知道啦"]
                            };
                            var alertBox = alertFn(dat);
                            $('#alert_box').remove();
                            $('body').append(alertBox);

                            alertBox.show(); //在固定的位置直接使用
                            alertBox.find('#alert_confirm').on('click', function() {
                                WeixinJSBridge.call('closeWindow');
                                alertBox.hide();
                            });
                            return
                        } else if (argv.errMsg == "startSearchBeacons:bluetooth power off") {
                            // alert("蓝牙未打开");
                            // WeixinJSBridge.call('closeWindow');
                            var dat = {
                                type: "confirm_error",
                                // type:"select",
                                text: "蓝牙未打开",
                                inte: "",
                                desc: "",
                                imgsrc: "img/err.png",
                                btn_text: ["知道啦"]
                            };
                            var alertBox = alertFn(dat);
                            $('#alert_box').remove();
                            $('body').append(alertBox);

                            alertBox.show(); //在固定的位置直接使用
                            alertBox.find('#alert_confirm').on('click', function() {
                                WeixinJSBridge.call('closeWindow');
                                alertBox.hide();
                            });
                            return
                        } else if (argv.errMsg == "startSearchBeacons:system unsupported") {
                            // alert("系统不支持");
                            // WeixinJSBridge.call('closeWindow');
                            var dat = {
                                type: "confirm_error",
                                // type:"select",
                                text: "系统不支持",
                                inte: "",
                                desc: "",
                                imgsrc: "img/err.png",
                                btn_text: ["知道啦"]
                            };
                            var alertBox = alertFn(dat);
                            $('#alert_box').remove();
                            $('body').append(alertBox);

                            alertBox.show(); //在固定的位置直接使用
                            alertBox.find('#alert_confirm').on('click', function() {
                                WeixinJSBridge.call('closeWindow');
                                alertBox.hide();
                            });
                            return
                        } else if (argv.errMsg == "startSearchBeacons:already started") {
                            // alert("上次搜索设备未关闭");
                            // WeixinJSBridge.call('closeWindow');
                            var dat = {
                                type: "confirm_error",
                                // type:"select",
                                text: "上次搜索设备未关闭",
                                inte: "",
                                desc: "",
                                imgsrc: "img/err.png",
                                btn_text: ["知道啦"]
                            };
                            var alertBox = alertFn(dat);
                            $('#alert_box').remove();
                            $('body').append(alertBox);

                            alertBox.show(); //在固定的位置直接使用
                            alertBox.find('#alert_confirm').on('click', function() {
                                WeixinJSBridge.call('closeWindow');
                                alertBox.hide();
                            });
                            return
                        } else {
                            wx.onSearchBeacons({
                                complete: function(data) {
                                    if (data.beacons.length) {
                                        for (var i in data.beacons) {
                                            var this_beacon = data.beacons[i];
                                            if (((this_beacon.major == beacons1[0] && this_beacon.minor == beacons1[1]) || (this_beacon.major == beacons2[0] && this_beacon.minor == beacons2[1])|| (this_beacon.major == beacons3[0] && this_beacon.minor == beacons3[1])|| (this_beacon.major == beacons4[0] && this_beacon.minor == beacons4[1])) && this_beacon.rssi > -65) {
                                                ok = true;
                                                wx.stopSearchBeacons({
                                                    complete: function(res) {
                                                        sessionStorage.setItem('yesORno', "y");
                                                        light();
                                                    }
                                                });
                                                break
                                            } else {
                                                times = times + 1;
                                            }
                                        }
                                    }
                                    if (times >= 3 && !ok) {
                                        wx.stopSearchBeacons({
                                            complete: function(res) {
                                                $("#loadingToast").hide();
                                                // alert('请在宝洁展台附近扫描二维码');
                                                var dat = {
                                                    type: "confirm_error",
                                                    // type:"select",
                                                    text: "请您到明酷展区体验寻宝互动，谢谢配合！",
                                                    inte: "",
                                                    desc: "",
                                                    imgsrc: "img/err.png",
                                                    btn_text: ["知道啦"]
                                                };
                                                var alertBox = alertFn(dat);
                                                $('#alert_box').remove();
                                                $('body').append(alertBox);

                                                alertBox.show(); //在固定的位置直接使用
                                                alertBox.find('#alert_confirm').on('click', function() {
                                                    WeixinJSBridge.call('closeWindow');
                                                    alertBox.hide();
                                                });
                                                return
                                            }
                                        });
                                    }
                                }
                            });
                        }

                    }
                });
            });
        }

    });

    function light() {
        $("#loadingToast").hide();
        var third_party_openid, index_url;
        var aqueryy = window.location.href.split("?");
        third_party_openid = urlGet()['xjj_openId'];
        index_url = aqueryy[0];
        var allimg = document.getElementsByClassName("img");
        var stamp_list = [1, 3, 5, 7, 10, 9, 12, 13, 11, 8, 6, 4, 2]
        var stamp_code_map = {
            "61u1zz1rTO": "MQ==",
            "fn90S2eT31": "Mg==",
            "46Ou81b0r1": "Mw==",
            "i5aDm3235L": "NA==",
            "z98z14fnzT": "NQ==",
            "jL202Oar9D": "Ng==",
            "q4D6W94yT8": "Nw==",
            "m191mT13yD": "OA==",
            "v1e4701Xz5": "OQ==",
            "0iPmz52D95": "MTA=",
            "2C8OO64KC9": "MTE=",
            "u9rzj92L90": "MTI=",
            "inT9W684z5": "MTM="
        }
        var host = "http://ab.aikaka.com.cn/Acmp/AcmpApi/";
        var SuccessCode = "200";
        var openid;
        openid = urlGet()['openid'];
        var activity_id;
        activity_id = urlGet()['activity_id'];
        var stamp_id
        stamp_id = urlGet()['stamp_id'];

        for (var i = 0; i < allimg.length; i++) {
            allimg[i].setAttribute('stamp_id', stamp_list[i]);
        };
        ajax_get(openid, activity_id, stamp_id, host, SuccessCode, allimg);

        if (typeof(third_party_openid) == "undefined") {
            var _url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state=" + index_url + "QwechatQ30000019QwechatQactivity_id=" + urlGet()['activity_id'] + "QwechatQopenid=" + urlGet()['openid'] + "#wechat_redirect";
            window.location.href = _url;
        }

        function ajax_get(openid, activity_id, stamp_id, host, SuccessCode, allimg) {
            var getdata = {};
            getdata.openid = openid;
            getdata.activity_id = activity_id;
            if (stamp_id) {
                getdata.stamp_id = decodeURIComponent(stamp_id);
                $.ajax({
                    type: "POST",
                    url: host + "stamp/apply",
                    data: getdata,
                    dataType: "json",
                    success: function(data) {
                        if (data.return_code == SuccessCode) {
                            getlist(data, allimg);
                        } else {
                            var dat = {
                                type: "confirm_error",
                                // type:"select",
                                text: data.return_msg,
                                inte: "",
                                desc: "",
                                imgsrc: "img/err.png",
                                btn_text: ["知道啦"]
                            };
                            var alertBox = alertFn(dat);
                            $('#alert_box').remove();
                            $('body').append(alertBox);

                            alertBox.show(); //在固定的位置直接使用
                            alertBox.find('#alert_confirm').on('click', function() {
                                WeixinJSBridge.call('closeWindow');
                                alertBox.hide();
                            });
                            return
                        };
                    }
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: host + "stamp/countByUser",
                    data: getdata,
                    dataType: "json",
                    success: function(data) {
                        if (data.return_code == SuccessCode) {
                            getlist(data, allimg);
                        } else {
                            var dat = {
                                type: "confirm_error",
                                // type:"select",
                                text: data.return_msg,
                                inte: "",
                                desc: "",
                                imgsrc: "img/err.png",
                                btn_text: ["知道啦"]
                            };
                            var alertBox = alertFn(dat);
                            $('#alert_box').remove();
                            $('body').append(alertBox);

                            alertBox.show(); //在固定的位置直接使用
                            alertBox.find('#alert_confirm').on('click', function() {
                                WeixinJSBridge.call('closeWindow');
                                alertBox.hide();
                            });
                            return
                        };
                    },
                    error: function(data) {
                        var dat = {
                            type: "confirm_error",
                            // type:"select",
                            text: "领取失败",
                            inte: "",
                            desc: "",
                            imgsrc: "img/err.png",
                            btn_text: ["知道啦"]
                        };
                        var alertBox = alertFn(dat);
                        $('#alert_box').remove();
                        $('body').append(alertBox);

                        alertBox.show(); //在固定的位置直接使用
                        alertBox.find('#alert_confirm').on('click', function() {
                            WeixinJSBridge.call('closeWindow');
                            alertBox.hide();
                        });
                        return
                    }
                });
            }
        }

        //进入首页获取已经获得的印花list;
        function getlist(data, allimg) {
            var getImg = data.data;
            if (getImg.length) {
                for (var i = 0; i < allimg.length; i++) {
                    for (var j = 0; j < getImg.length; j++) {
                        var a = allimg[i].getAttribute("stamp_id");
                        var img_src_first = allimg[i].getAttribute("src").split("_")[0];
                        if (a == getImg[j].stamp_id) {
                            allimg[i].src = img_src_first + "_y.png"
                        }
                    }
                }
            }
        }


        $(".btn_right").click(function() {
            $(".show_box").css("display", "block")
        });
        $(".btn_left1").click(function() {
            $(".show_box").css("display", "none")
        });
        $('.btn_left').click(function() {
            wx.ready(function() {
                wx.scanQRCode({
                    needResult: 1,
                    desc: 'scanQRCode desc',
                    success: function(res) {
                        var result = res.resultStr;
                        //window.location.href = result;
                        var code = result.split('?url=')[1]

                        var stamp_id = stamp_code_map[code];

                        ajax_get(openid, activity_id, stamp_id, host, SuccessCode, allimg);
                    }
                });
            });
        });
        var flag = true;
        $(".btn_right1").click(function() {
            var getTicket = {}
            getTicket.openid = openid;
            getTicket.activity_id = activity_id;
            getTicket.third_party_openid = third_party_openid;
            getTicket.third_party_name = "jushihui";
            //获取卡券;
            if (flag) {
                flag = false;
                $.ajax({
                    type: "POST",
                    url: host + "shakeFor/drawStamp",
                    data: getTicket,
                    dataType: "json",
                    success: function(data) {
                        if (data.return_code != 200) {
                            var dat = {
                                type: "confirm_error",
                                // type:"select",
                                text: data.return_msg,
                                inte: "",
                                desc: "",
                                imgsrc: "img/err.png",
                                btn_text: ["知道啦"]
                            };
                            var alertBox = alertFn(dat);
                            $('#alert_box').remove();
                            $('body').append(alertBox);

                            alertBox.show(); //在固定的位置直接使用
                            alertBox.find('#alert_confirm').on('click', function() {
                                WeixinJSBridge.call('closeWindow');
                                alertBox.hide();
                            });
                            return
                        } else {
                            if (urlGet()['subscribe'] == 1) {
                                window.location.href = 'http://ab.aikaka.com.cn/Coupon/show_webcoupon' + "?coupon_code=" + data.data.coupon_code;
                            } else {
                                window.location.href = 'http://t.cn/RcBraHp';
                            }
                        }
                    },
                    error: function(data) {
                        var dat = {
                            type: "confirm_error",
                            // type:"select",
                            text: "领取失败",
                            inte: "",
                            desc: "",
                            imgsrc: "img/err.png",
                            btn_text: ["知道啦"]
                        };
                        var alertBox = alertFn(dat);
                        $('#alert_box').remove();
                        $('body').append(alertBox);

                        alertBox.show(); //在固定的位置直接使用
                        alertBox.find('#alert_confirm').on('click', function() {
                            WeixinJSBridge.call('closeWindow');
                            alertBox.hide();
                        });
                        return
                    }
                });

            }

        })

    }

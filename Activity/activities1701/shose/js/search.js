$("#loadingToast").show();
$("#loadingToast .weui_toast p").html("设备搜索中");
var ajax_url = "http://ab.aikaka.com.cn/AcmpBeta/AcmpApi/";
var device_list = [];
var activity_id;
activity_id = urlGet()['activity_id'];
var store_code;
store_code = urlGet()['store_code'];
var beacon_data = {};
beacon_data.activity_id = activity_id;
beacon_data.store_code = store_code;
$.ajax({
    type: "POST",
    url: ajax_url + "scanFor/deviceList",
    data: beacon_data,
    dataType: "json",
    success: function(data) {
        if (data.return_code != 200) {
            $("#loadingToast").hide();
            my_alert("confirm", "提示",data.return_msg,"",["知道啦"],["black"],function(){
               WeixinJSBridge.call('closeWindow');
            })
        } else {
            var device_list = data.data.device_list;
            var necessary = data.data.device_necessary;
            var url = data.data.url;
            var flag = false;
            var array_box = [];
            wx.ready(function() {
                wx.startSearchBeacons({
                    complete: function(argv) {
                        if (argv.errMsg == "startSearchBeacons:location service disable") {
                            my_alert("confirm", "提示","地理位置服务未打开，","",["知道啦"],["black"],function(){
                                WeixinJSBridge.call('closeWindow');
                            }) 
                        } else if (argv.errMsg == "startSearchBeacons:bluetooth power off") {
                            my_alert("confirm", "提示","蓝牙未打开","",["知道啦"],["black"],function(){
                                WeixinJSBridge.call('closeWindow');
                            })
                        } else if (argv.errMsg == "startSearchBeacons:system unsupported") {
                            my_alert("confirm", "提示","系统不支持","",["知道啦"],["black"],function(){
                                WeixinJSBridge.call('closeWindow');
                            })
                        } else if (argv.errMsg == "startSearchBeacons:already started") {
                            my_alert("confirm", "提示","上次搜索设备未关闭","",["知道啦"],["black"],function(){
                                WeixinJSBridge.call('closeWindow');
                            })
                        } else {
                            wx.onSearchBeacons({
                                complete: function(data) {
                                    for (var i = 0; i < data.beacons.length; i++) {
                                        var mm = {}
                                        mm.major = data.beacons[i].major;
                                        mm.minor = data.beacons[i].minor;
                                        array_box.push(mm)
                                    };
                                    
                                    for (var i = 0; i < array_box.length; i++) {
                                        for (var j = 0; j < device_list.length; j++) {
                                            if (array_box[i].major == device_list[j].major && array_box[i].minor == device_list[j].minor) {
                                            	flag=true;
                                                $("#loadingToast").hide();
                                                wx.stopSearchBeacons({
                                                    complete: function(res) {
                                                        // alert("匹配成功");
                                                         my_alert("confirm", "提示","请求失败，请检查网络","",["知道啦"],["black"],function(){
													       $("#btn").removeAttr("disabled");
													    }) 
                                                    }
                                                });
                                                break
                                            }
                                        }
                                    }
                                    if(!flag){
                                    	if (!necessary) {
	                                        $("#loadingToast").hide();
                                            $("#btn").removeAttr("disabled");
	                                    } else {
	                                        $("#loadingToast").hide();
	                                        wx.stopSearchBeacons({
	                                            complete: function(res) {
	                                               my_alert("confirm", "提示","抱歉无法参与此活动","",["知道啦"],["black"],function(){
	                                                   WeixinJSBridge.call('closeWindow');
	                                                })
	                                           }
	                                        });
	                                    }
                                    }  
                                }
                            });
                        }
                    }
                });
            });
        }
    },
    error: function(msg) {
        $("#loadingToast").hide();
         my_alert("confirm", "提示","请求失败，请检查网络","",["知道啦"],["black"],function(){
           WeixinJSBridge.call('closeWindow');
        })
    }
});

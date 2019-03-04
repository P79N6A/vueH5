$(document).ready(function() {　　
    $('body').height($('body')[0].clientHeight);
})
$(".img_5").click(function() {
    var myname = $(".myname").val().trim()
    var myphone = $(".myphone").val().trim()
    var Taname = $(".Taname").val().trim()
    var Taphone = $(".Taphone").val().trim()
    if (!myname) {
        my_alert("confirm_error", "提交失败", "我的名字不能为空", "请填写！", ["知道啦"], ["black"], function() {})
        return false
    } else if (myname.length > 20) {
        my_alert("confirm_error", "提交失败", "我的名字字符不能超过20位字符", "请重新填写！", ["知道啦"], ["black"], function() {});
        $(".myname").val("")
        return false
    }
    if (!myphone) {
        my_alert("confirm_error", "提交失败", "我的手机号码不能为空", "请填写！", ["知道啦"], ["black"], function() {})
        return false
    } else if (!(/^1[34578]\d{9}$/.test(myphone))) {
        my_alert("confirm_error", "提交失败", "我的手机号码不正确", "请重新填写！", ["知道啦"], ["black"], function() {});
        $(".myphone").val("")
        return false
    }
    if (!Taname) {
        my_alert("confirm_error", "提交失败", "Ta的名字不能为空", "请填写！", ["知道啦"], ["black"], function() {})
        return false
    } else if (Taname.length > 20) {
        my_alert("confirm_error", "提交失败", "Ta的名字字符不能超过20位字符", "请重新填写！", ["知道啦"], ["black"], function() {});
        $(".Taname").val("")
        return false
    }

    if (!Taphone) {
        my_alert("confirm_error", "提交失败", "Ta的手机号码不能为空", "请填写！", ["知道啦"], ["black"], function() {})
        return false
    } else if (!(/^1[34578]\d{9}$/.test(Taphone))) {
        my_alert("confirm_error", "提交失败", "Ta的手机号码不正确", "请重新填写！", ["知道啦"], ["black"], function() {});
        $(".Taphone").val("")
        return false
    } else if (Taphone == myphone) {
        my_alert("confirm_error", "提交失败", "两个手机号码不能重复", "请填写！", ["知道啦"], ["black"], function() {})
        return false
    } else if(localStorage.sub_flag){
       my_alert("confirm_error", "提交失败", "您已经参与过此活动", "", ["知道啦"], ["black"], function() {})
        return false
    }
    var tex_info = {
        "myname": myname,
        "myphone": myphone,
        "Taname": Taname,
        "Taphone": Taphone
    }
    sessionStorage.setItem('tex_info', JSON.stringify(tex_info));
    var getData = {};
    getData.openid = urlGet()['openid'];
    getData.activity_id = urlGet()['activity_id'];
    getData.activity_item_id = urlGet()['activity_item_id'];
    getData.buyer_get_info = myname + "||" + myphone + "||" + Taname + "||" + Taphone;
    $("#loadingToast").show();
    $.ajax({
        type: "POST",
        url: acmp_host + "shakeFor/gift",
        data: getData,
        dataType: "json",
        success: function(data) {
            $("#loadingToast").hide();
            if (data.return_code != 200) {
                my_alert("confirm_error", "领取失败", data.return_msg, "", ["知道啦"], ["#000000"], function() {})
            } else {
                localStorage.setItem('move', "1");
                localStorage.setItem('sub_flag', "1");
                window.location.href = "text.html";
            }
        },
        error: function(data) {
            $("#loadingToast").hide();
            my_alert("confirm_error", "加载失败", "网络出现问题啦，", "请再试试吧！", ["知道啦"], ["#000000"], function() {
                WeixinJSBridge.call('closeWindow');
            })
        }

    });

});

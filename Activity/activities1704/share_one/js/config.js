var this_url = window.location.href;
if ($.trim(this_url).substr(0, 9) == "http://ab") {
    var subscribe_a_url = "http://ab.aikaka.com.cn/shakeApp/activities1704/cola_translates/qr_a.html";
    var index_url= "http://ab.aikaka.com.cn/shakeApp/activities1704/cola_translates/translate_qr.html";
} else if ($.trim(this_url).substr(0, 11) == "http://acmp") {
    var subscribe_a_url = "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1704/cola_translates/qr_a.html";
    var index_url= "http://acmp.aikaka.com.cn/cocacola/shakeApp/activities1704/cola_translates/translate_qr.html";
}
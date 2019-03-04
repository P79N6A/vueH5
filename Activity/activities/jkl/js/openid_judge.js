//获取URL中的Query字符串,不支持中文传递
	function getQueryString(name) {
		 var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		 var r = window.location.search.substr(1).match(reg);
		 if (r != null) {
		 	return unescape(r[2]);
		 } else {
		 	return "";
		 }
	}

	//判断是否有openid
	function hasArg(arg) {
		var url = window.location.href;
		if (getQueryString(arg) == "") {
			var get_openid = "http://ab.aikaka.com.cn/jklEShop/oauth2?redirect_url="+encodeURIComponent(url);
			var target = "http://jkl.valuedeep.com/oauth/getAccessToken.do?sourceId=jkluser1&sharedKey=86d1ce2c94a736b6&redirectUrl="+encodeURIComponent(get_openid);
			window.location.href = target;
		}
	}
	hasArg("jkl_openid");

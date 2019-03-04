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
			window.location.href = "http://ab.aikaka.com.cn/PublicService/Weixin/oauthExplicitAndCallback.php?callback_url="+ url;
		}
	}
	hasArg("openid");
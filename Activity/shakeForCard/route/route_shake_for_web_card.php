<?php 
require_once(__DIR__."/../api/remoteHelper.php");
require_once(__DIR__."/../api/controller/shake_for_card.php");
require_once(__DIR__."/../api/commonUtil.php");

//获取web卡券
$app->map("/shakeForWebCard/coupon",function() use ($app){
	$param = $_GET;

	$decodeJson = RemoteHelper::https_request(STRING_DECODE_URL,array(
		"app_id"=>APP_ID,
		"code"=>$param['code']
		));

	$decodeResult = json_decode($decodeJson,true);
	
	$param = json_decode($decodeResult['param_string'],true);

	$coupon_code = $param['coupon_code'];
	//从coupon_code中取出coupon_id
	$coupon_id = ShakeForCard::couponDecode($coupon_code);
	$openid = $param['openid'];

	//get coupon info
	$coupon = ShakeForCard::getCouponById($coupon_id);
	//get coupon status
	$coupon_status = ShakeForCard::getCouponStatusByCode($coupon_code);
	$coupon['coupon_code'] = $coupon_code;
	$coupon['coupon_status'] = $coupon_status;

	//生成核销链接
	$encodeJson = RemoteHelper::https_request(STRING_ENCODE_URL,array(
		"app_id"=>APP_ID,
		"param_string"=>$coupon_code
		));
	$encodeResult = json_decode($encodeJson,true);
	
	if($encodeResult['retCode']!=0){
		if(DEBUG) die("param encode error");
		$app->redirect(DEFAULT_PAGE."?_t=".rand());  //请求异常则中转到默认的页面
		exit;
	}
	$code = $encodeResult['code'];
	$consume_url = "http://ab.aikaka.com.cn/shakeApp/shakeForCard/shakeForWebCard/enter_code?code=$code";
	echo $app->render("/shakeForWebCard/webcoupon.html",array(
		"coupon"=>$coupon,
		"openid"=>$openid,
		"consume_url"=>$consume_url
		));

})->via("GET");

//显示web卡券
$app->map("/shakeForWebCard/show_webcoupon",function() use ($app){
	$param = $_GET;
	if(!isset($param['coupon_code'])){
		if(DEBUG) die("coupon_code missing");
		$app->redirect(DEFAULT_PAGE."?_t=".rand());  //请求异常则中转到默认的页面
		exit;
	}
	$coupon_code = $param['coupon_code'];
	//从coupon_code中取出coupon_id
	$coupon_id = ShakeForCard::couponDecode($coupon_code);
	$openid = "";
	//get coupon info
	$coupon = ShakeForCard::getCouponById($coupon_id);
	//get coupon status
	$coupon_status = ShakeForCard::getCouponStatusByCode($coupon_code);
	$coupon['coupon_code'] = $coupon_code;
	$coupon['coupon_status'] = $coupon_status;

	//生成核销链接
	$encodeJson = RemoteHelper::https_request(STRING_ENCODE_URL,array(
		"app_id"=>APP_ID,
		"param_string"=>$coupon_code
		));
	$encodeResult = json_decode($encodeJson,true);
	if($encodeResult['retCode']!=0){
		if(DEBUG) die("param encode error");
		$app->redirect(DEFAULT_PAGE."?_t=".rand());  //请求异常则中转到默认的页面
		exit;
	}
	$code = $encodeResult['code'];
	$consume_url = "http://ab.aikaka.com.cn/shakeApp/shakeForCard/shakeForWebCard/enter_code?code=$code";

	echo $app->render("/shakeForWebCard/webcoupon.html",array(
		"coupon"=>$coupon,
		"openid"=>$openid,
		"consume_url"=>$consume_url
		));

})->via("GET");

//web卡券详情
$app->map("/shakeForWebCard/coupondetail",function() use ($app){
	$param = $_GET;
	if(!isset($param['coupon_id'])){
		if(DEBUG) die("coupon_id missing");
		$app->redirect(DEFAULT_PAGE."?_t=".rand());  //请求异常则中转到默认的页面
		exit;
	}
	$coupon = ShakeForCard::getCouponById($param['coupon_id']);
	echo $app->render("/shakeForWebCard/webcoupon_detail.html",array(
		"coupon"=>$coupon
		));

})->via("GET");

//web卡券核销
$app->map("/shakeForWebCard/enter_code",function() use($app){
	if(!isset($_GET['openid'])){
		$self_url = (isset($_SERVER['HTTPS']) ? "https" : "http") . 
			"://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
		$auth_url = "http://ab.aikaka.com.cn/PublicService/Weixin/oauthAndCallback.php?callback_url=".urlencode($self_url);
		$app->redirect($auth_url);
		exit;
	}

	if(!isset($_GET['code'])){
		if(DEBUG) die("code missing");
		$app->redirect(DEFAULT_PAGE."?_t=".rand());  //请求异常则中转到默认的页面
		exit;
	}
	$code = $_GET['code'];
	$openid = $_GET['openid'];

	$decodeJson = RemoteHelper::https_request(STRING_DECODE_URL,array(
		"app_id"=>APP_ID,
		"code"=>$code
		));

	$decodeResult = json_decode($decodeJson,true);
	if($decodeResult['retCode']!=0){
		if(DEBUG) die("param decode error");
		$app->redirect(DEFAULT_PAGE."?_t=".rand());  //请求异常则中转到默认的页面
		exit;
	}

	$coupon_code = $decodeResult['param_string'];
	$coupon = ShakeForCard::getCouponByCode($coupon_code);

	$status = 0;
	$user_id = $coupon['user_id'];
	//检查核销权限
	if(!ShakeForCard::verifyCheckUser($openid,$user_id)){
		$status = "您无权核销";	
	}

	if(empty($coupon)){
		$status = "无效的卡券";
	}else if($coupon['status']!=0){
		$status = "卡券已核销"; 	
	}else if(time()>$coupon['end_timestamp']){
		$status = "卡券已过期";
	}
	$isUserRemembered = ShakeForCard::isUserRemembered($openid,$user_id,60*20);  //20分钟内登录过
	echo $app->render("/shakeForWebCard/enter_code.html",array(
		"status"=>$status,
		"code"=>$code,
		"openid"=>$openid,
		"isUserRemembered"=>$isUserRemembered,
		"user_id"=>$user_id  //卡券所属的商户ID
		));

})->via("GET");

//我的卡券
$app->map("/shakeForWebCard/coupon_list",function() use($app){
	if(!isset($_GET['openid'])){
		$self_url = (isset($_SERVER['HTTPS']) ? "https" : "http") . 
			"://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
		$auth_url = "http://ab.aikaka.com.cn/PublicService/Weixin/oauthAndCallback.php?callback_url=".urlencode($self_url);
		$app->redirect($auth_url);
		exit;
	}
	$openid = $_GET['openid'];
	$coupon_list = ShakeForCard::getCouponsByOpenid($openid);
	echo $app->render("/shakeForWebCard/coupon_list.html",array(
		"coupon_list"=>$coupon_list
		));
})->via("GET");

//默认页
$app->map("/shakeForWebCard/notify",function() use ($app){
	$title = "未中奖";
	$content = "谢谢!!请继续摇一摇抽奖";

	echo $app->render("/shakeForWebCard/notify.html",array(
		"title"=>$title,
		"content"=>$content
		));
})->via("GET");

//API
//记录访问卡券记录
//目前在getCoupon时会自动设置visit record
$app->map("/coupon/setVisitRecord",function(){
	$result = array();
	$param = $_REQUEST;
	if(!isset($param['user_id'])){
		$result['retCode'] =-1;
		$result['retMsg'] = "user_id missing";
		die(json_encode($result));
	}
	if(!isset($param['coupon_id'])){
		$result['retCode'] =-1;
		$result['retMsg'] = "coupon_id missing";
		die(json_encode($result));
	}

	$result = ShakeForCard::visitCoupon($param['user_id'],$param['coupon_id']);
	die(json_encode($result));
})->via("POST","GET");

//记录领取卡券记录
$app->map("/coupon/setApplyRecord",function(){
	$result = array();
	$param = $_REQUEST;
	if(!isset($param['user_id'])){
		$result['retCode'] =-1;
		$result['retMsg'] = "user_id missing";
		die(json_encode($result));
	}
	if(!isset($param['coupon_id'])){
		$result['retCode'] =-1;
		$result['retMsg'] = "coupon_id missing";
		die(json_encode($result));
	}
	if(!isset($param['coupon_code'])){
		$result['retCode'] =-1;
		$result['retMsg'] = "coupon_code missing";
		die(json_encode($result));
	}

	$result = ShakeForCard::applyCoupon($param['user_id'],$param['coupon_id'],$param['coupon_code']);
	die(json_encode($result));
})->via("POST","GET");

//核销卡券记录
$app->map("/coupon/setConsumeRecord",function(){
	$result = array();
	$param = $_REQUEST;
	if(!isset($param['code'])){
		$result['retCode'] =-1;
		$result['retMsg'] = "code missing";
		die(json_encode($result));
	}
	if(!isset($param['openid'])){
		$result['retCode'] =-1;
		$result['retMsg'] = "openid missing";
		die(json_encode($result));
	}
	if(!isset($param['user_id'])){
		$result['retCode'] =-1;
		$result['retMsg'] = "user_id missing";
		die(json_encode($result));
	}
	//参数解密
	$code = $param['code'];
	$openid = $param['openid'];
	$user_id = $param['user_id'];
	$decodeJson = RemoteHelper::https_request(STRING_DECODE_URL,array(
		"app_id"=>APP_ID,
		"code"=>$code
		));

	$decodeResult = json_decode($decodeJson,true);
	if($decodeResult['retCode']!=0){
		$result['retCode'] =-1;
		$result['retMsg'] ="param decode error";
		die(json_encode($result));
	}

	$coupon_code = $decodeResult['param_string'];
	if(!ShakeForCard::isUserRemembered($openid,$user_id,60*20)){
		$password = isset($param['password'])?$param['password']:"";
		//检查核销密码
		$user = ShakeForCard::checkUserLogin($openid,$user_id,$password);
		if($user===false){
			$result['retCode'] =-2;
			$result['retMsg'] ="password incorrect";
			die(json_encode($result));
		}	
	}
	$user = ShakeForCard::verifyCheckUser($openid,$user_id);
	$result = ShakeForCard::consumeCoupon($coupon_code,$user['check_user_id'],$user['name']);
	die(json_encode($result));

})->via("POST","GET");

?>
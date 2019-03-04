<?php 
require_once(__DIR__."/../api/remoteHelper.php");
require_once(__DIR__."/../api/controller/page.php");
require_once(__DIR__."/../api/controller/shake_for_card.php");
require_once(__DIR__."/../api/commonUtil.php");


//首页，直接领取卡券
$app->get("/coupon/",function() use ($app){
	//参数解密
	$code = $_GET['code'];

	$decodeJson = RemoteHelper::https_request(STRING_DECODE_URL,array(
		"app_id"=>APP_ID,
		"code"=>$code
		));

	$decodeResult = json_decode($decodeJson,true);

	$param = json_decode($decodeResult['param_string'],true);

	$result = ShakeForCard::getCoupon($param['page_id'],$openid,ACTIVITY_ID,true);  //使用定义好的活动ID
	
	$coupon = $result['coupon'];
	
	if($coupon['coupon_type']==1){
		//web卡券
		//参数加密
		$param_string = json_encode(array(
			"coupon_code"=>$coupon['coupon_code'],
			"openid"=>$openid
			));
		$encodeJson = RemoteHelper::https_request(STRING_ENCODE_URL,array(
			"app_id"=>APP_ID,
			"param_string"=>$param_string
			));
		$encodeResult = json_decode($encodeJson,true);
		
		$code = $encodeResult['code'];
		
		$app->redirect("shakeForWebCard/coupon?code=$code");
	}else{
		//微信卡券
		$app->redirect("shakeForWeixinCard/coupon?code=$code");
	}
});

//通过H5页面摇一摇领卡券
$app->get("/shake/index",function() use($app){
	//参数解密
	$code = $_GET['code'];
	$decodeJson = RemoteHelper::https_request(STRING_DECODE_URL,array(
		"app_id"=>APP_ID,
		"code"=>$code
		));
	$decodeResult = json_decode($decodeJson,true);
	$param = json_decode($decodeResult['param_string'],true);
	$openid = $param['openid'];

	$page = PageControl::getPageById($param['page_id']);
	
	$app->render("/shake/index.html",array(
		"page"=>$page,
		"openid"=>$openid,
		"activity_id"=>$_GET['activity_id']
		));
});

//通过H5页面摇一摇领卡券
$app->get("/shake/chaoshifa",function() use($app){
	//参数解密
	/*$code = $_GET['code'];
	$decodeJson = RemoteHelper::https_request(STRING_DECODE_URL,array(
		"app_id"=>APP_ID,
		"code"=>$code
		));

	$decodeResult = json_decode($decodeJson,true);
	$param = json_decode($decodeResult['param_string'],true);*/

	$entry = "unknown";

	if(isset($_GET['entry'])){
		$entry = $_GET['entry'];
	}

	$param = $_GET;
	if(!isset($param['openid'])){
		$redirect_url = "http://ab.aikaka.com.cn/shakeApp/shakeForCard/shake/chaoshifa?entry=$entry";
		$app->redirect("http://ab.aikaka.com.cn/PublicService/Weixin/oauthExplicitAndCallback.php?callback_url=".urlencode($redirect_url));
	}
	$openid = $param['openid'];
	$page_id = 7;
	$activity_id = "csf_online";
	$page = PageControl::getPageById($page_id);
	
	$app->render("/shake/shake_csf.html",array(
		"page"=>$page,
		"openid"=>$openid,
		"activity_id"=>$activity_id
		));
});

$app->get("/shake/getCoupon",function(){
	$param = $_GET;
	$page_id = $param['page_id'];
	$openid = $param['openid'];
	$activity_id = $param['activity_id'];

	//是否直接领取奖品
	$auto_apply = false;
	if($activity_id=="sdyx"){
		$auto_apply = true;
	}

	$shake_result = ShakeForCard::getCoupon($page_id,$openid,$activity_id,$auto_apply);

	if($shake_result['retCode']==0){
		$result['retCode'] = 0;
		
		$coupon = $shake_result['coupon'];
		$result['coupon_type'] = $coupon['coupon_type'];
		if($coupon['coupon_type']==1){
			//web卡券
			//参数加密
			$param_string = json_encode(array(
				"coupon_code"=>$coupon['coupon_code'],
				"openid"=>$openid
				));
			$encodeJson = RemoteHelper::https_request(STRING_ENCODE_URL,array(
				"app_id"=>APP_ID,
				"param_string"=>$param_string
				));
			$encodeResult = json_decode($encodeJson,true);
			
			$code = $encodeResult['code'];
			$result['code'] = $code;
		}else{
			//微信卡券
			$result['coupon_id'] = $shake_result['coupon']['coupon_id'];
			$result['card_list'] = CouponControl::getCouponParamString($shake_result['coupon']);
		}
		die(json_encode($result));
	}else{
		die(json_encode($shake_result));
	}

});

//根据卡券ID和用户ID获取拉取卡券的参数
$app->get("/coupon/ext",function(){
	$param = $_GET;
	$cardExt = CouponControl::getCouponParamString($param);

	$result = array(
		"retCode"=>0,
		"cards" => $cardExt
		);

	die(json_encode($result));

})

?>
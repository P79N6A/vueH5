<?php 
require_once(__DIR__."/config.php");
require_once(__DIR__."/controller/feedback.php");
require_once(__DIR__."/controller/card.php");


//收集用户反馈
$app->map("/feedback/insert",function(){
	$param = $_POST;
	$result = array();
	if(!isset($param['openid'])){
		$result['retCode'] = -1;
		$result['retMsg'] = "openid missing";
		die(json_encode($result));
	}
	if(!isset($param['content'])){
		$result['retCode'] = -1;
		$result['retMsg'] = "content missing";
		die(json_encode($result));
	}
	$openid = $param['openid'];
	$content = $param['content'];
	if(FeedbackControl::insertFeedback($openid,$content)){
		$result['retCode'] = 0;
		$result['retMsg'] = "success";
		die(json_encode($result));
	}else{
		$result['retCode'] = -2;
		$result['retMsg'] = "insert fail";
		die(json_encode($result));
	}

})->via("POST");


//获取拉取卡券需要的信息
$app->map("/card/ext",function(){
	$param = $_GET;

	if(!isset($param['card_id'])){
		$result['retCode'] = -1;
		$result['retMsg'] = "card_id missing";
		die(json_encode($result));
	}

	$result['retCode'] = 0;
	$result['cards'] = Card::getCardExt(array($param['card_id']),APPSECRET);
	die(json_encode($result));

})->via("GET");
//获取拉取卡券需要的信息
$app->map("/card/ext_csf",function(){
	$param = $_GET;

	if(!isset($param['card_id'])){
		$result['retCode'] = -1;
		$result['retMsg'] = "card_id missing";
		die(json_encode($result));
	}

	$result['retCode'] = 0;
	$result['cards'] = Card::getCardExt(array($param['card_id']),"5e7c13e636ba49a291dd8b4f59e61bd0");
	die(json_encode($result));

})->via("GET");




 ?>
<?php  

require_once(__DIR__."/../api/remoteHelper.php");
require_once(__DIR__."/../api/controller/shake_for_card.php");
require_once(__DIR__."/../api/controller/coupon.php");
require_once(__DIR__."/../api/commonUtil.php");

//获取卡券
//获取的同时会设置卡券访问记录
$app->get("/shakeForWeixinCard/getCoupon",function() use ($app) {
	$param = $_GET;
	$page_id = $param['page_id'];
	$openid = $param['openid'];
	$activity_id = $param['activity_id'];
	$shake_result = ShakeForCard::getCoupon($page_id,$openid,$activity_id,false);
	if($shake_result['retCode']==0){
		$result['retCode'] = 0;
		$result['coupon_id'] = $shake_result['coupon']['coupon_id'];
		$result['card_list'] = CouponControl::getCouponParamString($shake_result['coupon']);
	}else{
		$retMsg = "未知状态";
		switch ($shake_result['retCode']) {
			case '-2':
				$retMsg = "活动尚未开始或已经结束";
				break;
			case "-3":
				$retMsg = "未设置卡券";
				break;
			case "-4":
				$retMsg = "没有机会了";
				break;
			case "-5":
				$retMsg = "您已经领取了所有的卡券";
				break;
			case "-6":
				$retMsg = "没有可用的卡券";
				break;
			case "-7":
				$retMsg = "未中奖";
				break;
			default:
				# code...
				break;
		}


		$result['retCode'] = -1;
		$result['retMsg'] = $retMsg; 	
	}

	die(json_encode($result));
});

//领取卡券
//微信卡券的领取记录会通过回调自动加入到数据库wx_event_card
//此处只需要在redis中记录领取行为
$app->post("/coupon/setWeixinApplyRecord",function(){
	$user_id = $_POST['user_id'];
	$coupon_id = $_POST['coupon_id'];
	//在Redis中存储记录,将用户访问记录修改为领取状态
	if(!RedisActivityControl::userGetCard($user_id,$coupon_id)){
		$result['retCode'] = -1;
		$result['retMsg'] = "set apply record fail";
	}else{
		$result['retCode'] = 0;
		$result['retMsg'] = "success";
	}
	die(json_encode($result));
});

?>
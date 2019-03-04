<?php  
require_once(__DIR__."/../api/remoteHelper.php");
require_once(__DIR__."/../api/model/coupon.php");
require_once(__DIR__."/../api/controller/shake_for_card.php");
require_once(__DIR__."/../api/controller/redis_activity_control.php");
require_once(__DIR__."/../api/config.php");
require_once(__DIR__."/../api/redisHelper.php");
require_once(__DIR__."/../api/commonUtil.php");

//查看卡券库存
$app->map("/shakeForWebCard/coupon_stock",function() use ($app){
	//获取卡券列表
	$coupon_list = Coupon::getCouponsByPageId(4);
	foreach ($coupon_list as $coupon) { 
		//获取库存
		$stock_info = RedisActivityControl::getCardInfo($coupon['coupon_id']);
		$coupon_list[$coupon['coupon_id']]['stock'] = 0;
		$coupon_list[$coupon['coupon_id']]['get'] = 0;
		if($stock_info){
			$coupon_list[$coupon['coupon_id']]['stock'] = $stock_info['count'];
			$coupon_list[$coupon['coupon_id']]['get'] = $stock_info['get'];
		}
	}

	$start_time = strtotime(START_TIME);
	$now = time();

	$app->render("/shakeForWebCard/coupon_stock.html",array(
		"coupon_list"=>$coupon_list,
		"start_time"=>$start_time,
		"now"=>$now,
		));

})->via("GET");

//随机卡券测试
$app->get("/coupon_test/:count",function($count){
	for($i = 1; $i <=$count; $i++){
		$result = ShakeForCard::getCoupon(4,$i,ACTIVITY_ID,true);
		echo $i.":".json_encode($result)."<br/>";
	}
});

//清除测试数据
$app->get("/clear_test",function(){
	RedisHelper::setKeyValue("card_info_75","1_0_0_1444957365_1445043765");
	RedisHelper::setKeyValue("card_info_76","10_0_0_1444957365_1445043765");
	RedisHelper::setKeyValue("card_info_77","18_0_0_1444957365_1445043765");
	echo "重置库存 <br/>";

	$users = RedisHelper::getKeys("user_record_*");
	foreach ($users as $user){
		RedisHelper::deleteKey($user);
	}
	echo "用户访问记录删除:".count($users)." <br/>";


});


?>
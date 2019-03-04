<?php 

require_once(__DIR__."/../api/redisHelper.php");

$app->get("/shakeForPage/chaoshifa",function() use ($app){

	if(!isset($_GET['openid'])){
		$redirect_url = "http://ab.aikaka.com.cn/shakeApp/shakeForCard/shakeForPage/chaoshifa";
		$app->redirect("http://ab.aikaka.com.cn/PublicService/Weixin/oauthExplicitAndCallback.php?callback_url=".urlencode($redirect_url));
	}
	$openid = $_GET['openid'];

	/*//记录访问次数
	$redis_visit_time_key = "user_visit_time";

	$visitNum = RedisHelper::HashIncrBy($redis_visit_time_key,$openid,1);

	$pages = array();

	$pages['url1'] = "/shakeApp/activities/csf/card1.html";
	$pages['url2'] = "/shakeApp/activities/csf/card2.html";
	$pages['url3'] = "/shakeApp/activities/csf/card3.html";
	$pages['url4'] = "/shakeApp/activities/csf/card4.html";

	$portal = "/shakeApp/activities/csf/portal/demo.html";


	$target = $portal;
	if($visitNum%3!=0){
		$key = array_rand($pages);
		$target = $pages[$key];
	}*/

	$app->redirect("/shakeApp/activities/csf/portal/demo.html?openid=".$_GET['openid']."&_t=".time());
});





?>
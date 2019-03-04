<?php
require_once(__DIR__."/redis_activity_control.php");
require_once(__DIR__."/../model/coupon.php");
require_once(__DIR__."/../model/check_user.php");
require_once(__DIR__."/../redisHelper.php");
require_once(__DIR__."/../weixinHelper.php");
require_once(__DIR__."/../commonUtil.php");

Logger::configure(__DIR__.'/../../log4php/config/visit.properties');

class ShakeForCard{
	public static function getCoupon($page_id,$openid,$activity_id,$apply){
		$result = array();
		//if there is available activity 
		$perUserLimit = RedisActivityControl::getLimit($activity_id);
		if($perUserLimit==null||$perUserLimit['count']==0){
		    $result['retCode'] = -2;
		    $result['retMsg'] = "活动尚未开始或已经结束";
		    
		    //打印日志
		    CommonUtil::generateStringLog("",
		    	date("Y-m-d H:i:s",time())."\t".
		    	$openid."\t".
		    	$page_id."\t".
		    	$activity_id."\t".
		    	json_encode($result));

		    return $result;
		}

		//get coupon
		$card_list = Coupon::getCouponsByPageId($page_id);
		if(sizeof($card_list)==0){
		    $result['retCode'] = -3;
		    $result['retMsg'] = "没有设置卡券, page_id = ".$page_id;

		    //打印日志
		    CommonUtil::generateStringLog("",
		    	date("Y-m-d H:i:s",time())."\t".
		    	$openid."\t".
		    	$page_id."\t".
		    	$activity_id."\t".
		    	json_encode($result));

		    return $result;
		}

		//user get coupon record
		$user_get_count = 0;
		$userGetCardResult = RedisActivityControl::userGetCardList($openid);
		foreach ($card_list as $key => $coupon) {
		    if(isset($userGetCardResult[$coupon['coupon_id']])){
		        if($userGetCardResult[$coupon['coupon_id']]['get_time']>$perUserLimit['start']&&
		            $userGetCardResult[$coupon['coupon_id']]['get_time']<$perUserLimit['end']
		        ){
		            $user_get_count++;    //在当前活动时间内用户领取卡券的次数不能超过限制
		        }
		        unset($card_list[$key]);  //在所有活动中，用户领过的卡券不会再显示
		    }
		}		

		//get count exceed the limit
		if($user_get_count>=$perUserLimit['count']){
		    $result['retCode'] = -4;
		    $result['retMsg'] = "没有机会了";
		    $result['detail'] = array("get_count"=>$user_get_count,"limit_count"=>$perUserLimit['count']);

		    //打印日志
		    CommonUtil::generateStringLog("",
		    	date("Y-m-d H:i:s",time())."\t".
		    	$openid."\t".
		    	$page_id."\t".
		    	$activity_id."\t".
		    	json_encode($result));

		    return $result;
		}

		if(sizeof($card_list)==0){
		    $result['retCode'] = -5;
		    $result['retMsg'] = "您已经领取了所有的卡券";

		    //打印日志
		    CommonUtil::generateStringLog("",
		    	date("Y-m-d H:i:s",time())."\t".
		    	$openid."\t".
		    	$page_id."\t".
		    	$activity_id."\t".
		    	json_encode($result));

		    return $result;
		}
		//check coupon stock and lifetime
		$card_stock = array();
		foreach($card_list as $key => $coupon){
			$coupon_id = $coupon['coupon_id'];
		    $cardInfo = RedisActivityControl::getCardInfo($coupon_id);

		    $currentTime = time();
		    if(empty($cardInfo)||
		    	$cardInfo['count']==0 || 
		        $currentTime<$cardInfo['start'] || 
		        $currentTime>$cardInfo['end']
		    ){
		        unset($card_list[$key]);
		    }else{
				$card_stock[$coupon_id] = $cardInfo['count'];		    	
		    }
		}

		if(sizeof($card_list)==0){
		    $result['retCode'] = -6;
		    $result['retMsg'] = "卡券已领完";

		    //打印日志
		    CommonUtil::generateStringLog("",
		    	date("Y-m-d H:i:s",time())."\t".
		    	$openid."\t".
		    	$page_id."\t".
		    	$activity_id."\t".
		    	json_encode($result));

		    return $result;
		}
		//随机出奖,
		$recommended_coupon_id = self::recommenderCoupon($card_stock,0.8);

		//如果没中奖
		if($recommended_coupon_id==-1){
			$result['retCode'] = -7;
			$result['retMsg'] = "很遗憾没有中奖";

			//打印日志
		    CommonUtil::generateStringLog("",
		    	date("Y-m-d H:i:s",time())."\t".
		    	$openid."\t".
		    	$page_id."\t".
		    	$activity_id."\t".
		    	json_encode($result));

			return $result;
		}

		$coupon_result = $card_list[$recommended_coupon_id];


		//为卡券生成Code  时间戳+卡券ID+随机数
		$coupon_result['coupon_code'] = self::couponEncode($recommended_coupon_id);

		//set visit record
		ShakeForCard::visitCoupon($openid,$coupon_result['coupon_id']);
		
		//卡券自动放入卡包
		if($apply){
			//set apply record
			ShakeForCard::applyCoupon($openid,$coupon_result['coupon_id'],$coupon_result['coupon_code']);
		}

		$result['retCode'] = 0;
		$result['coupon'] = $coupon_result;


		//打印日志
		CommonUtil::generateStringLog("",
			date("Y-m-d H:i:s",time())."\t".
			$openid."\t".
			$page_id."\t".
			$activity_id."\t".
			json_encode($result));

		return $result;
	}

	static function getCouponById($coupon_id){
		return Coupon::getCouponById($coupon_id);
	}

	static function getCouponsByOpenid($openid){
		return Coupon::getCouponsByOpenid($openid);
	}

	static function applyCoupon($user_id,$coupon_id,$coupon_code){
		$result = array();
		//检查卡券的有效性
		$coupon = Coupon::getCouponById($coupon_id);
		if(!isset($coupon['user_id'])){
			$result['retCode'] = -1;
			$result['retMsg'] = "coupon is invalid";
			return $result;
		}
		//将领券记录添加到数据库中
		if(!Coupon::applyCoupon($coupon_id,$coupon_code,$coupon['user_id'],$user_id,$user_id)){
			$result['retCode'] = -2;
			$result['retMsg'] = "add apply record fail";
			return $result;
		}
		//在Redis中存储记录,将用户访问记录修改为领取状态
		if(!RedisActivityControl::userGetCard($user_id,$coupon_id)){
			$result['retCode'] = -3;
			$result['retMsg'] = "cache apply record fail";
			return $result;
		}
		$result['retCode'] = 0;
		$result['retMsg'] = "success";
		return $result;
	}

	static function visitCoupon($user_id,$coupon_id){
		$result = array();
		//用户多次访问不会重复记录(TODO:需要修改为每次都记录)
		$record = RedisActivityControl::getUserVisitCardRecord($user_id,$coupon_id);

		if(empty($record)){
			RedisActivityControl::setUserVisitRecord($user_id,$coupon_id);
			$result['retCode'] = 0;
		    $result['retMsg'] = "success";
		    return $result;
		}else{
			$result['retCode'] = -2;
		    $result['retMsg'] = "record existed";
		    return $result;
		}
	}

	static function checkUserLogin($openid,$user_id,$password){
		$checkUser = CheckUser::checkUserLogin($openid,$user_id,$password);
		if(!isset($checkUser['openid'])){
			return false;
		}else{
			//缓存登录信息
			self::rememberUser($openid,$user_id);
			return $checkUser;
		}
	}
	static function verifyCheckUser($openid,$user_id){
		$checkUser = CheckUser::getCheckUser($openid,$user_id);
		if(!isset($checkUser['openid'])){
			return false;
		}else{
			return $checkUser;
		}
	}
	static function consumeCoupon($coupon_code,$check_user_id,$check_user_name){
		//检查卡券状态
		$coupon = self::getCouponByCode($coupon_code);
		if(isset($coupon['status'])&&$coupon['status']==0){
			if(Coupon::consumeCoupon($coupon_code,$check_user_id,$check_user_name)){
				/*//在Redis中存储记录,将用户领取记录修改为已核销状态
				if(!RedisActivityControl::userConsumeCard($coupon['user_id'],$coupon['coupon_id'])){
					$result['retCode'] = -3;
					$result['retMsg'] = "cache consume record fail";
					return $result;
				}*/
				$result['retCode'] = 0;
			    $result['retMsg'] = "success";
			    return $result;
			}	
		}
		$result['retCode'] = -1;
		$result['retMsg'] = "consume fail";
		return $result;
	}

	static function getCouponByCode($coupon_code){
		return Coupon::getCouponRecordByCode($coupon_code);
	}

	static function getCouponStatusByCode($coupon_code){
		$result = Coupon::getCouponRecordByCode($coupon_code);
		if(!isset($result['status'])){
			return -1;
		}else{
			return $result['status'];
		}
	}


	static function recommenderCoupon($data,$prob){
		//奖品中添加无奖的项,保证整体中奖率为20%
		$data['-1'] = max(0,(1/$prob-1))*array_sum($data);
		//按奖品数量加权随机
		return self::getRandomWeightedElement($data);
	}

	/**
    * getRandomWeightedElement()
    * Utility function for getting random values with weighting.
    * Pass in an associative array, such as array('A'=>5, 'B'=>45, 'C'=>50)
    * An array like this means that "A" has a 5% chance of being selected, "B" 45%, and "C" 50%.
    * The return value is the array key, A, B, or C in this case.  Note that the values assigned
    * do not have to be percentages.  The values are simply relative to each other.  If one value
    * weight was 2, and the other weight of 1, the value with the weight of 2 has about a 66%
    * chance of being selected.  Also note that weights should be integers.
    * 
    * @param array $weightedValues
    */
	static function getRandomWeightedElement(array $weightedValues) {
	    $rand = mt_rand(1, (int) array_sum($weightedValues));

	    foreach ($weightedValues as $key => $value) {
	      	$rand -= $value;
	    	if ($rand <= 0) {
	        	return $key;
	      	}
		}
	}


	static function couponEncode($coupon_id){
		return (1000000+$coupon_id).time().rand(1000,9999);
	}
	static function couponDecode($coupon_code){
		return substr($coupon_code,0,7)-1000000;
	}


	//添加用户登录信息到Redis
	static function rememberUser($openid,$user_id){
		$key = "login_user_".$openid."_".$user_id;
		$value = time();
		return redisHelper::setKeyValue($key,$value); //always true
	}

	static function isUserRemembered($openid,$user_id,$intervalSeconds){
		$key = "login_user_".$openid."_".$user_id;
		$last_login_time = redisHelper::getValueByKey($key);
		if((time()-$last_login_time)<$intervalSeconds){
			self::rememberUser($openid,$user_id);
			return true;
		}
		else{
			return false;
		}
	}
}

?>
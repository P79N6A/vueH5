<?php 

class CouponControl{
	static function getCouponParamString($coupon){
		$cards['card_list'] = array();
		$card = array();
		$timestamp = time();

		//使用各自的APPSECRET推送卡券
		$app_secret = APPSECRET;
		switch($coupon['user_id']){
			case "chaoshifa": $app_secret = "5e7c13e636ba49a291dd8b4f59e61bd0";
			case "jingkelong": $app_secret = "390216e8b5f5b665ce17a9860d163588";
		}

		//卡券信息
		$card['card_id'] = $coupon['card_id'];
		if(isset($coupon['code'])){
			$card['code'] = $coupon['code'];
		}
		if(isset($coupon['openid'])){
			$card['openid'] = $coupon['openid'];
		}
		$card['timestamp'] = strval($timestamp);
		$card['nonce_str'] = self::getNonceStr();
		$card['api_ticket'] = $app_secret; 
		asort($card,SORT_STRING);
		//生成签名
		$card['signature'] = sha1(join("",$card));

		//按拉取卡券接口所需的格式返回
		$card_item["card_id"] = $card['card_id'];
		unset($card['card_id']);
		$card_item["card_ext"] = json_encode($card);

		array_push($cards['card_list'],$card_item);
		return $cards;
	}

	/**
	 * 
	 * 产生随机字符串，不长于32位
	 * @param int $length
	 * @return 产生的随机字符串
	 */
	static function getNonceStr($length = 32) 
	{
		$chars = "abcdefghijklmnopqrstuvwxyz0123456789";  
		$str ="";
		for ( $i = 0; $i < $length; $i++ )  {  
			$str .= substr($chars, mt_rand(0, strlen($chars)-1), 1);  
		} 
		return $str;
	}




}




?>
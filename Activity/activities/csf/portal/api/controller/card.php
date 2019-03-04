<?php 

class Card{
	static function getCardExt($card_ids,$app_secret){
		foreach ($card_ids as $card_id) {
			$card = array();
			$timestamp = time();
			//卡券信息
			$card['card_id'] = $card_id;
			$card['timestamp'] = strval($timestamp);
			$card['nonce_str'] = self::getNonceStr();
			$card['api_ticket'] = $app_secret;
			asort($card,SORT_STRING);
			//生成签名
			$card_sign = sha1(join("",$card));

			//按拉取卡券接口所需的格式返回
			$card_item["card_id"] = $card['card_id'];
			$card_item["card_ext"] = json_encode(array(
				"timestamp"=>$card['timestamp'],
				"nonce_str"=> $card['nonce_str'],
				"signature"=>$card_sign));

			$cards['card_list'] = array();
			array_push($cards['card_list'],$card_item);
		}
		return $cards;
	}
}







 ?>
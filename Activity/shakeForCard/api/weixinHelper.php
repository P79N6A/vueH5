<?php
require_once(__DIR__."/config.php");
require_once(__DIR__."/commonUtil.php");
require_once(__DIR__."/redisHelper.php");
require_once(__DIR__."/remoteHelper.php");

class WeixinHelper{
	//获取用户基本信息
	static function getUserInfo($code){
		$get_openid_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".APPID."&secret=".APPSECRET."&code=".$code."&grant_type=authorization_code";
		$json = RemoteHelper::https_request($get_openid_url);
		$auth_result = json_decode($json);
		if(isset($auth_result->openid)){
			$access_token = self::getWxAccessToken();
			$get_user_info_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$access_token&openid=".$auth_result->openid."&lang=zh_CN";
			$user_result = json_decode(RemoteHelper::https_request($get_user_info_url));
			return $user_result;
		}
		return "unexpected_result_from_oauth_api";
	}

	//通过code换取网页授权access_token->获取用户的信息
	static function getWxUserAuthorization($code){
		$result = array();
		$auth_cache = RedisHelper::getValueByKey($code);
		$auth_result = json_decode($auth_cache);
		if(!isset($auth_result->openid)){
			$get_openid_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".APPID."&secret=".APPSECRET."&code=".$code."&grant_type=authorization_code";
			$json = RemoteHelper::https_request($get_openid_url);
			//5秒内缓存取到用户信息，解决微信重复回调的问题 
			RedisHelper::setKeyValueEx($code,5,$json);
			$auth_result = json_decode($json);	
		}
		//var_dump($auth_result);
		if(isset($auth_result->openid)){
			$result['openid'] = $auth_result->openid;
			//返回详细的用户信息：昵称，头像等 
			$get_user_info_url = "https://api.weixin.qq.com/sns/userinfo?access_token=".$auth_result->access_token."&openid=".$auth_result->openid."&lang=zh_CN";
			$user_json = RemoteHelper::https_request($get_user_info_url);
			$user_result = json_decode($user_json);
			if(isset($user_result->nickname)){
				$result["user_detail"] = $user_result;
			}else{
			}
			CommonUtil::generateStringLog($code,json_encode($user_result));
			return $result;
		}else{
			CommonUtil::generateStringLog("auth_result",json_encode($auth_result));
			return "unexpected_result_from_oauth_api";
		}
	}

	//获取（基础支持）access token有效期为两个小时，每天最多请求2000次
	static function getWxAccessToken(){
		$access_token_key = "wx_access_token_key";
		$access_token_value = RedisHelper::getValueByKey($access_token_key);
		if($access_token_value == false){
			$access_token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".
			APPID."&secret=".APPSECRET;

			$json = RemoteHelper::https_request($access_token_url);
			$result = json_decode($json);
			if(isset($result->access_token)){
				$access_token_value = $result->access_token;
				RedisHelper::setKeyValueEx($access_token_key, 7000, $access_token_value);
			}else{
				return "unexpected_result_from_access_token_api";
			}
		}
		return $access_token_value;
	}
	//获取card ticket
	static function getWxCardTicket(){
		$card_ticket_key = "wx_card_ticket_key";
		$card_ticket_value = RedisHelper::getValueByKey($card_ticket_key);
		if($card_ticket_value == false){
			$access_token = self::getWxAccessToken();
			$get_ticket_url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=".$access_token.
				"&type=wx_card";

			$json = RemoteHelper::https_request($get_ticket_url);
			$result = json_decode($json, true);
			if(isset($result->ticket)){
				$card_ticket_value = $result->ticket;
				RedisHelper::setKeyValueEx($card_ticket_key,7000,$card_ticket_value);
			}else{
				return "unexpected_result_from_card_ticket_api";
			}
		}
		return $card_ticket_value;
	}
	//获取调用jsapi所需的凭据
	static function getWxJsApiTicket() {
		$js_api_ticket_key = "wx_js_api_ticket";
        $js_api_ticket = RedisHelper::getValueByKey($js_api_ticket_key);
        if($js_api_ticket == false){
            $accessToken = self::getWxAccessToken();
            $js_api_ticket_url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
            $json = RemoteHelper::https_request($js_api_ticket_url);
            $result = json_decode($json,true);
            if(isset($result['ticket'])){
            	$js_api_ticket = $result['ticket'];
            	RedisHelper::setKeyValueEx($js_api_ticket_key,7000,$js_api_ticket);
            }else{
            	return "unexpected_result_from_js_ticket_api";
            }
            
        }
        return $js_api_ticket;
  }
}

?>
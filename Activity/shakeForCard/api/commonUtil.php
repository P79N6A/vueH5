<?php
require_once(__DIR__."/config.php");
require_once(__DIR__."/redisHelper.php");
require_once(__DIR__."/../log4php/Logger.php");
Logger::configure(__DIR__.'/../log4php/config/test.properties');
date_default_timezone_set('Asia/Hong_Kong');

class CommonUtil{
	static function getIpAddress() {
	    $ip_keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR');
	    foreach ($ip_keys as $key) {
	        if (array_key_exists($key, $_SERVER) === true) {
	            foreach (explode(',', $_SERVER[$key]) as $ip) {
	                // trim for safety measures
	                $ip = trim($ip);
	                // attempt to validate IP
	                if (self::validate_ip($ip)) {
	                    return $ip;
	                }
	            }
	        }
	    }
	    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : false;
	}
	/**
	 * Ensures an ip address is both a valid IP and does not fall within
	 * a private network range.
	 */
	static function validate_ip($ip)
	{
	    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
	        return false;
	    }
	    return true;
	}
	static function getConnection() {
		$dbhost = DBHOST;
		$dbuser = DBUSER;
		$dbpass = DBPASSWORD;
		$dbname = DBNAME;
		$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
		return $dbh;
	}

	static function generateDebugArrayLog($logger, $msg){
		if(DEBUG == false)
			return;
		$log = Logger::getLogger($logger);
		$msgs = '';
		foreach($msg as $key=>$value){
			$msgs = $msgs . $key . ':' .$value . ' ';
		}
		//$log->trace($flow_msg);
		$log->debug($msgs);
	}

	static function generateArrayLog($logger, $msg){
		$log = Logger::getLogger($logger);
		$msgs = '';
		foreach($msg as $key=>$value){
			$msgs = $msgs . $key . ':' .$value . ' ';
		}
		//$log->trace($flow_msg);
		$log->debug($msgs);
	}
	static function generateDebugStringLog($logger, $msg){
		if(DEBUG == false)
			return;
		$log = Logger::getLogger($logger);
		$log->debug($msg);
	}
	static function generateStringLog($logger, $msg){
		$log = Logger::getLogger($logger);
		$log->trace($msg);
	}

	//处理错误/警告/意料之外的请求
	static function showNotification($err_code){
		//记录非法请求的数量
		$redis_notify_summary_key = "notify_summary_".APP_ID;
		RedisHelper::HashIncrBy($redis_notify_summary_key,$err_code,1);
		header("Location:notify.php?err_code=$err_code");

		if(DEBUG==true){
			die("ERR_CODE:".$err_code);
		}
		Logger::configure('log4php/config/notify.properties');
		$request_url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING'];
		$refer_url = $_SERVER['HTTP_REFERER'];
		self::generateArrayLog("notify_record",array(
			"err_code"=>$err_code,
			"request_url"=>$request_url,
			"request_referrer" =>$refer_url
			));
		
		exit;
	}
	//根据APP_ID获取对应的SECRET_KEY
	static function getSecretKey($app_id){
		return "fd949b45a6bd710bbb86af43a0bb725c";
	}

	//根据传递的参数计算token
	static function getToken(){
		$varArray = func_get_args();     //获取参数，返回参数数组
        $varStr = "";
        foreach($varArray as $value){
        	$varStr.=$value;
        }
        return md5($varStr);
	}
}

class NotifyType{
	//10 referrer error
	const wx_required = "1001";
	const ref_empty = "1002";
	const ref_not_allowed = "1003";
	const session_expired = "1004";

	//11 param error
	const param_invalid = "1100";
	const app_id_missing = "1101";
	const oauth_code_missing = "1102";
	const oauth_state_missing = "1103";
	const token_missing = "1103";
	
	//12 token
	const secret_key_not_found = "1201";
	const token_incorrect = "1202";
	
	//13 wx error
	const wx_openid_missing="1301";

	
}


?>
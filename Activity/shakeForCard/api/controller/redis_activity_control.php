<?php
require_once(__DIR__."/../redisHelper.php");

class RedisActivityControl{
	//设置时间区域和限制次数
	static function setTimeRangeLimit($activity_id,$start_time,$end_time,$count){
		$key = "card_per_user_limit_activity_".$activity_id;
		$field = $start_time."~".$end_time;
		return redisHelper::setHashSet($key,$field,$count)==1;  //如果是更新已存在的记录则返回false
	}

	//获取所有的时间区域
	static function getTimeRangeLimits($activity_id){
		$key = "card_per_user_limit_activity_".$activity_id;
	 	return redisHelper::getHashAll($key);
	}

	//根据当前时间获取当前商户对用户的限制次数
	static function getLimit($activity_id){
		$limits = self::getTimeRangeLimits($activity_id);
		foreach ($limits as $key => $value) {
			$time = explode("~",$key);
			if(sizeof($time)==2){
				$start = intval($time[0]);
				$end = intval($time[1]);
				$now = time();
				if($start<=$now&&$end>=$now){
					return array("start" => $start, "end" => $end, "count" => $value);
				}
			}
		}
	}

	//添加用户查看卡券记录
	static function setUserVisitRecord($user_id,$card_id){
		$now = time();
		$key = "user_record_".$user_id;
		$value = "0_".$now;
		return redisHelper::setHashSet($key,$card_id,$value)==1; //添加新记录，返回值为1
	}

	//获取用户已查看的卡券列表
	static function getUserVisitRecords($user_id){
		$key = "user_record_".$user_id;
		
		return redisHelper::getHashAll($key);
	}

	//获取用户查看卡券的记录
	static function getUserVisitCardRecord($user_id,$card_id){
		$key = "user_record_".$user_id;
		$field = $card_id;
		$value =  redisHelper::getHashValue($key,$field);
		$vals = explode("_",$value);
		if(sizeof($vals)==2){
			return array("status"=>$vals[0],"time"=>$vals[1]);
		}
		return array();
	}

	private static function setUserGetCardRecord($user_id,$card_id){
		$visit = self::getUserVisitCardRecord($user_id,$card_id);
		if(isset($visit['status'])&&$visit['status'] == 0){  //只有visit状态才更新为get状态
			$now = time();
			$key = "user_record_".$user_id;
			$value = "1_".$now;
			return redisHelper::setHashSet($key,$card_id,$value)==0;  //更新已存在的记录，返回值为0
		}
		return false;
	}
	private static function setUserConsumeCardRecord($user_id,$card_id){
		$visit = self::getUserVisitCardRecord($user_id,$card_id);
		if(isset($visit['status'])&&$visit['status'] == 1){  //只有get状态才更新为consume状态
			$now = time();
			$key = "user_record_".$user_id;
			$value = "2_".$visit['time'];
			return redisHelper::setHashSet($key,$card_id,$value)==0;  //更新已存在的记录，返回值为0
		}
		return false;
	}

	static function userGetCardList($user_id){
		$card_list = array();
		$list = self::getUserVisitRecords($user_id);
		foreach ($list as $key => $value) {
			$vals = explode("_",$value);
			if(sizeof($vals)==2&&$vals[0] > 0 ){
				 $card_list[$key] = array("status"=>$vals[0],"get_time"=>$vals[1]);
			}
		}
		return $card_list;


	}
	//用户已查看过的卡券list(在整个活动过程中)
	static function getViewedCardList($user_id){
		$key = "user_record_".$user_id;
		return redisHelper::getHashKeys($key);
	}

	//将卡券信息插入Redis
	//totalcount_getcount_consumecount_start_end
	static function setCardInfo($card_id,$count,$get,$consume,$start,$end){
		$key = "card_info_".$card_id;
		$card_info = $count."_".$get."_".$consume."_".$start."_".$end;
		return redisHelper::setKeyValue($key,$card_info);  //always return true
	}

	//将卡券信息导入Redis
	static function syncCardInfo($card_id,$count,$start,$end){
		return self::setCardInfo($card_id,$count,0,0,$start,$end);
	}
	

	//根据CardId获取卡券信息，（有效时间和剩余数量）
	static function getCardInfo($card_id){
		$key = "card_info_".$card_id;
		$card_info =  redisHelper::getValueByKey($key);
		$infos = explode("_",$card_info);
		if(sizeof($infos)==5){
			return array(
				"count"=>$infos[0], 
				"get" => $infos[1],
				"consume" => $infos[2], 
				"start" => $infos[3],
				"end" => $infos[4]);
		}
		else{ 
			return array();
		}
	}

	//更新卡券剩余数量
	static function userGetCard($user_id,$card_id){
		$set_result = self::setUserGetCardRecord($user_id,$card_id);
		if($set_result){ 
			$card = self::getCardInfo($card_id);
			$card['count']--;
			$card['get']++;
			if(sizeof($card)==5){
				$final_result = self::setCardInfo($card_id,$card['count'],$card['get'],$card['consume'],$card['start'],$card['end']);
				return $final_result; //KeyValue: always return ture
			}
		}
		return false;
	}

	static function userConsumeCard($user_id,$card_id){
		if(self::setUserConsumeCardRecord($user_id,$card_id)){ 
			$card = self::getCardInfo($card_id);
			//$card['get']--;
			$card['consume']++;
			if(sizeof($card)==5){
				return self::setCardInfo($card_id,$card['count'],$card['get'],$card['consume'],$card['start'],$card['end']); //KeyValue: always return ture
			}
		}
		return false;
	}
}



?>

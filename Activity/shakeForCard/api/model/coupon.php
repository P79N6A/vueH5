<?php
require_once(__DIR__."/../commonUtil.php");
class Coupon{
	//获取页面上绑定的卡券列表
	static function getCouponsByPageId($page_id){			
		$sql = "SELECT coupon.coupon_id,title,coupon_type,card_id, begin_timestamp,coupon.user_id 
		FROM coupon, s_re_page_coupon 
		WHERE coupon.coupon_id = s_re_page_coupon.coupon_id 
		AND s_re_page_coupon.s_page_id = :page_id";

	    try{
			$db = commonUtil::getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('page_id', $page_id);
			$stmt->execute();
			$datas = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$db = null;
			$result = array();
			//将卡券ID设为Array Key
			foreach ($datas as $item) {
				$result[$item['coupon_id']] = $item;
			}
			return $result;
		}catch(PDOException $e){
			CommonUtil::generateStringLog(__FUNCTION__,$e->getMessage());
			return array();
		}
	}
	//获取用户的卡券列表
	static function getCouponsByOpenid($user_openid){			
		$sql = "SELECT a.coupon_id,a.coupon_code, a.status, a.user_openid, 
		b.title, b.sub_title, b.logo_url, b.begin_timestamp, b.end_timestamp
		FROM web_event_card a 
		LEFT OUTER JOIN coupon b
		ON a.coupon_id = b.coupon_id
		WHERE a.user_openid = :user_openid AND a.coupon_code!=''";

	    try{
			$db = commonUtil::getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('user_openid', $user_openid);
			$stmt->execute();
			$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$db = null;
			return $data;
		}catch(PDOException $e){
			CommonUtil::generateStringLog(__FUNCTION__,$e->getMessage());
			return array();
		}
	}
	//根据卡券ID获取卡券信息
	static function getCouponById($coupon_id){
		$sql = "SELECT *
		FROM coupon 
		WHERE coupon_id = :coupon_id";

	    try{
			$db = commonUtil::getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('coupon_id', $coupon_id);
			$stmt->execute();
			$data = $stmt->fetch(PDO::FETCH_ASSOC);
			$db = null;
			return $data;
		}catch(PDOException $e){
			CommonUtil::generateStringLog(__FUNCTION__,$e->getMessage());
			return array();
		}
	}

	//领取Web卡券
	static function applyCoupon($coupon_id,$coupon_code,$coupon_user_id,$akk_openid,$user_openid){
		$sql = "INSERT INTO web_event_card(coupon_id, coupon_code, user_id, akk_openid, user_openid, create_time, status) 
		VALUES (:coupon_id, :coupon_code, :user_id, :akk_openid, :user_openid, :create_time, 0)";
		$create_time = date('Y-m-d H:i:s', time());
		try{
			$db = commonUtil::getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam('coupon_id', $coupon_id);
            $stmt->bindParam('coupon_code', $coupon_code);
            $stmt->bindParam('user_id', $coupon_user_id);
			$stmt->bindParam('akk_openid', $akk_openid);
			$stmt->bindParam('user_openid', $user_openid);
			$stmt->bindParam('create_time', $create_time);
            $stmt->execute();
            $db = null;
            return true;
        }catch(PDOException $e){
			CommonUtil::generateStringLog(__FUNCTION__,$e->getMessage());
            return false;
        }
	}
	//核销Web卡券
	static function consumeCoupon($coupon_code,$check_user_id,$check_user_name){
		$sql = "UPDATE web_event_card 
		SET status = 1,
		last_update_time = :update_time, 
		check_user_id = :check_user_id,
		check_name = :check_user_name 
		WHERE coupon_code = :coupon_code";
		$update_time = date('Y-m-d H:i:s', time());
		try{
			$db = commonUtil::getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam('coupon_code', $coupon_code);
            $stmt->bindParam('check_user_id', $check_user_id);
            $stmt->bindParam('check_user_name', $check_user_name);
            $stmt->bindParam('update_time', $update_time);
            $stmt->execute();
            $db = null;
            return true;
        }catch(PDOException $e){
			CommonUtil::generateStringLog(__FUNCTION__,$e->getMessage());
            return false;
        }
	}

	//查询领取的Web卡券状态
	static function getCouponRecordByCode($coupon_code){
		$sql = "SELECT a.coupon_id,a.coupon_code,a.user_id,a.akk_openid,a.user_openid,a.create_time,a.status,
		b.begin_timestamp,b.end_timestamp
		FROM web_event_card a
		LEFT OUTER JOIN coupon b
		ON a.coupon_id = b.coupon_id 
		WHERE a.coupon_code = :coupon_code";

	    try{
			$db = commonUtil::getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('coupon_code', $coupon_code);
			$stmt->execute();
			$data = $stmt->fetch(PDO::FETCH_ASSOC);
			$db = null;
			return $data;
		}catch(PDOException $e){
			CommonUtil::generateStringLog(__FUNCTION__,$e->getMessage());
			return array();
		}
	}

	//删除Web奖券记录
	static function deleteRecord($user_id){
		$sql = "DELETE from web_event_card where user_id = :user_id";

	    try{
			$db = commonUtil::getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('user_id', $user_id);
			$stmt->execute();
			$db = null;
			return true;
		}catch(PDOException $e){
			CommonUtil::generateStringLog(__FUNCTION__,$e->getMessage());
			return false;
		}
	}
}


?>
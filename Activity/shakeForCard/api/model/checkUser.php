<?php
require_once(__DIR__."/../commonUtil.php");
class CheckUser{
	static function getCheckUser($openid,$password){			
		$sql = "SELECT check_user_id,user_id,name,contact,openid,store_id,store_name
		FROM check_user
		WHERE openid = :openid AND password = :password";

		$result = array();
	    try{
			$db = commonUtil::getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('openid', $openid);
			$stmt->bindParam('password', $password);
			$stmt->execute();
			$data = $stmt->fetch(PDO::FETCH_ASSOC);
			$db = null;
			return $data;
		}catch(PDOException $e){
			CommonUtil::generateStringLog(__FUNCTION__."exception", $e->getMessage());
			return array();
		}
	}
}


?>
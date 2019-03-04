<?php
require_once(__DIR__."/../commonUtil.php");
class Feedback{
	static function insert($openid,$content){			
		$sql = "INSERT INTO portal_feedback (content,openid,create_time,status) 
		VALUES(:content,:openid,:create_time,:status)";

		$create_time = date("Y-m-d H:m:s",time());
		$status = 0;

		$result = array();
	    try{
			$db = commonUtil::getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('content', $content);
			$stmt->bindParam('openid', $openid);
			$stmt->bindParam('create_time', $create_time);
			$stmt->bindParam('status', $status);
			$stmt->execute();
			$db = null;
			return true;
		}catch(PDOException $e){
			CommonUtil::generateStringLog(__FUNCTION__." exception", $e->getMessage());
			return false;
		}
	}
}


?>
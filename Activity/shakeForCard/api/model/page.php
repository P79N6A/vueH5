<?php
require_once(__DIR__."/../commonUtil.php");
class Page{
	static function getPageById($page_id){			
		$sql = "SELECT page_id,user_id,title,sub_title,page_url,comment,status
		FROM s_page 
		WHERE page_id = :page_id";

		$result = array();
	    try{
			$db = commonUtil::getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('page_id', $page_id);
			$stmt->execute();
			$data = $stmt->fetch(PDO::FETCH_ASSOC);
			$db = null;
			$result['flag'] = true;
			$result['page'] = $data;
			return $result;
		}catch(PDOException $e){
			$result['flag'] = false;
			$result['errMsg'] = $e->getMessage();
			CommonUtil::generateStringLog(__FUNCTION__."exception", $e->getMessage());
			return $result;
		}
	}
}


?>
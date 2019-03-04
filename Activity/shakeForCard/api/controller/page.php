<?php

require_once(__DIR__."/../model/page.php");
require_once(__DIR__."/../controller/settings.php");

class PageControl{
	static function getPageById($page_id){
		$page_result = Page::getPageById($page_id);
		if($page_result['flag']){
			return $page_result['page'];
		}
		return array();
	}
}




?>
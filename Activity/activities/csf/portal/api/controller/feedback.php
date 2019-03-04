<?php

require_once(__DIR__."/../model/feedback.php");

class FeedbackControl{
	static function insertFeedback($openid,$content){
		return Feedback::insert($openid,$content);
	}
}




?>
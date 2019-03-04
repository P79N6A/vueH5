<?php  
require_once(__DIR__."/remoteHelper.php");

$app->error("global_error_handler");

function global_error_handler ($error_level, $error_message, $file, $line) {
	
	$ERROR_HANDLER_PATH = "http://ab.aikaka.com.cn/PublicService/Util/errorHandler.php";

	$data = array(
		"project_name"=>"shake",
		"error_level"=>$error_level,
		"error_message"=>$error_message,
		"error_file"=>$file,
		"error_line"=>$line,
		);

	$json_result = RemoteHelper::https_request($ERROR_HANDLER_PATH,$data);

	die(json_encode(array(
		"retCode" => -999,
		"retMsg" => $data
		)));
}

$app->error("global_exception_handler");
function global_exception_handler ($exception) { 
	echo "Uncaught exception: " , $exception->getMessage(), "\n";
}

?>
<?php 
require_once(__DIR__."/config.php");
require_once(__DIR__."/jssdk.php");
$result = array();
$param = $_GET;
//check param
if(empty($param['url'])
	){
	die("give me url");
}

$jssdk = new JSSDK(APPID, APPSECRET);
$signPackage = $jssdk->GetSignPackage($_GET['url']);

$result['appId'] = $signPackage["appId"];
$result['timestamp'] = $signPackage["timestamp"];
$result['nonceStr'] = $signPackage["nonceStr"];
$result['signature'] = $signPackage["signature"];
echo json_encode($result);
?>
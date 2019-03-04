<?php  
require_once(__DIR__."/../api/config.php");

$type = isset($_GET['type'])?$_GET['type']:1;

if($type==1){
	$card_list= array(
		"pToLbjuOchUBrhg12dH2gMOR2t6w", //79.中粮集团 丹尼斯达曲奇150g
		"pToLbjtFRVgZUcLVK6UotLk9ybgg", //80.中粮集团 丹尼斯达曲奇250g
		"pToLbjnyS1AQTYBgWbaIFl07OGC4", //81.中粮集团 巴乐斯听装红酒
		"pToLbjubJVqkjC2zhxvwWxZISq0M", //82.中粮集团 荷兰金选华夫饼
		"pToLbjr-G6zB1dUkXiV894st22do"  //83.中粮集团 格兰蒂巧克力
		
		);
}else{
	$card_list = array(
		"pToLbjrN7uYOPU7dMg5ceuV_148Y", //84.爱咔咔 苹果主题公园门票
		"pToLbjgN1GYhojGtlZaZNbLuRj8U", //85.四海兴达 乌参
		"pToLbjjZ5JhwT3k1LtQVEBBtsQbE", //86.海参高 海参类产品
		"pToLbjvNUGOJbVuuxmE6Mv3WdEm8", //87.海参高 特价大虾
		"pToLbjrB8Fr3l4Yp7Cl3O7ZpzjxM", //88.海参高 鱼肉类
		"pToLbjn9eV1oleENI0Y2Zadiu4h0"  //89.海参高 大扇贝
		);
}

$cards['card_list'] = array();
foreach ($card_list as $card_id) {
	$card = array();
	$timestamp = time();
	//卡券信息
	$card['card_id'] = $card_id;
	$card['timestamp'] = strval($timestamp);
	$card['nonce_str'] = getNonceStr();
	$card['api_ticket'] = APPSECRET;
	asort($card,SORT_STRING);
	//生成签名
	$card_sign = sha1(join("",$card));

	//按拉取卡券接口所需的格式返回
	$card_item["card_id"] = $card['card_id'];
	$card_item["card_ext"] = json_encode(array(
		"timestamp"=>$card['timestamp'],
		"nonce_str"=> $card['nonce_str'],
		"signature"=>$card_sign));

	array_push($cards['card_list'],$card_item);
}

/**
 * 
 * 产生随机字符串，不长于32位
 * @param int $length
 * @return 产生的随机字符串
 */
function getNonceStr($length = 32) 
{
	$chars = "abcdefghijklmnopqrstuvwxyz0123456789";  
	$str ="";
	for ( $i = 0; $i < $length; $i++ )  {  
		$str .= substr($chars, mt_rand(0, strlen($chars)-1), 1);  
	} 
	return $str;
}

?>

<html>
<head>
	<title>卡券加载中</title>
	<meta name="viewport" content="width=device-width,initial-scale=1, user-scalable=yes, minimal-ui">
	<script type="text/javascript" src="http://ab.aikaka.com.cn/PublicService/Weixin/js/forbidShare.js"></script>
    <script type="text/javascript" src="js/zepto.min.js"></script>
	<script type="text/javascript">
 			//function for getting card
		    var readyFunc = function onBridgeReady() {
		        WeixinJSBridge.invoke('batchAddCard',<?php echo json_encode($cards); ?>,
		            function(res){
		           		//alert(JSON.stringify(res));
		                if(res.err_msg.indexOf("batch_add_card")==-1){  //微信有时会拒绝请求，返回access denied
	                        window.location.href = window.location.href;      
	                    }else{
	                    	//alert(JSON.stringify(res.card_list));

		            		//回调接口更新订单领取记录
		            		//window.location.href="callback.php?json_data="+JSON.stringify(res.card_list);
		            		if(res.err_msg=="batch_add_card:ok"){
			            		$("#message").html("领取成功，请通过【微信卡包】查看您的卡券");	
		            		}else{
		            			$("#message").html("领取失败，请返回入口重新领取【已领取的卡券不能重复领取】");
		            		}
	                    }
		            }
		        );
		    }
		 	if (typeof WeixinJSBridge === "undefined") {
				document.addEventListener('WeixinJSBridgeReady', readyFunc, false);
			} else {
				readyFunc(); 
			}
 	</script>
</head>
<body>
	<div id = "message">卡券加载中</div>
</body>
</html>
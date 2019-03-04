<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>开发者调用关注JS的example</title>
</head>
<body>
	<h1>test</h1>
<script type="text/javascript"src="http://zb.weixin.qq.com/nearbycgi/addcontact/BeaconAddContactJsBridge.js">
</script>
<script type="text/javascript">
	BeaconAddContactJsBridge.ready(function(){
		//判断是否关注
		BeaconAddContactJsBridge.invoke('checkAddContactStatus',{ type:0} ,function(apiResult){
			if(apiResult.err_code == 0){
				var status = apiResult.data;
				if(status == 1){
					alert('已关注');
				}else{
					alert('未关注');
					//跳转到关注页
					BeaconAddContactJsBridge.invoke('jumpAddContact',{ type:0});
				}
			}else{
				alert(apiResult.err_msg)
			}
		});

	});
</script>
</body>
</html>

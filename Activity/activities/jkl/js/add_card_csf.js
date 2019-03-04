$(document).ready(function() {
	var openid = getQueryString("jkl_openid");
	//拉取卡券
	$(".addCard").click(function(){
		var card_id = $(this).data("cardid");

		//readyFunc(card_id);

	 	if (typeof WeixinJSBridge === "undefined") {
			document.addEventListener('WeixinJSBridgeReady', function(){readyFunc(card_id);}, false);
		} else {
			readyFunc(card_id);
		}
	});

	//function for getting card
	var readyFunc = function onBridgeReady(card_id) {
		$.ajax({
			type: "GET",
			url: "/jklEShop/coupon/record/get",
			dataType:"json",
			data: {
				coupon_id: card_id,
				jkl_openid: openid,
				_t:Math.random()
			},
			success: function(res) {
				if (res.retCode==0) {
					$.ajax({
						type: "GET",
						url: "/shakeApp/shakeForCard/coupon/ext",
						data: {
							card_id:card_id,
							user_id:'jingkelong',
							code: res.coupon_code,
							openid: openid
						},
						dataType:"json",
						success: function(result) {
							if(result.retCode==0){
								WeixinJSBridge.invoke('batchAddCard',result.cards,
						            function(res){
						           		// alert(JSON.stringify(res));
						                if(res.err_msg.indexOf("batch_add_card")==-1){  //微信有时会拒绝请求，返回access denied
						                    window.location.href = window.location.href;
						                }else{
						                	//alert(JSON.stringify(res.err_msg));
						            		if(res.err_msg=="batch_add_card:ok"){
					            				swal({
													text: '卡券领取成功',
													confirmButtonText: '完成',
													confirmButtonColor: '#ffb700',
													timer: 1200
												});
						            		}else{
					            				swal({
													text: '卡券领取失败',
													confirmButtonText: '完成',
													confirmButtonColor: '#ffb700',
													timer: 1200
												});
						            		}
						                }
						            }
						        );
							}else{
			    				swal({
									text: '服务器错误',
									confirmButtonText: '完成',
									confirmButtonColor: '#ffb700',
									timer: 1200
								});
							}
						}
					});
				}
			}
		});

	};
});

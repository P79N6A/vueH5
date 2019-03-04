// $(document).ready(function() {
	var screenWidth = $(window).width(),
		screenHeight = $(window).height(),
		imgProportion = 290/750,
		icon = '';

	$('.container').css({'height': screenHeight + 'px','overflow': 'hidden'});
	$('.height-25').css({'height': screenHeight/4 + 'px','overflow': 'hidden'});
	$('.height-img').css({'height': screenHeight/4 - 40 + 'px'});
	$('.height-row2').css({'height': screenHeight/8 + 'px','overflow': 'hidden'});
	$('.sec-del').css({'height': screenHeight/4 - 20 + 'px','overflow': 'hidden'});
	$('.recommond-img').css({'height': (screenHeight/2 - 76)/2 +'px','width': screenWidth-48 + 'px'});

	var iconPadding = screenWidth*0.04,
		iconEle = $('.height-row2').height() - iconPadding - 20;
	if (iconEle > 100) {
		icon = '100px';
	}else {
		icon = iconEle + 'px';
	};
	$('.icon').css({'height': icon, 'width': iconEle+ 1 + 'px', 'background-size': icon});


	$('#menu-1').click(function() {
		menu($(this))
	});
	$('#menu-2').click(function() {
		menu($(this))
	});
	$('#menu-3').click(function() {
		menu($(this))
	});
	// $('#menu-4').click(function() {
		
		
	// });

	$('#wish-submit').click(function(){
		$(this).toggleClass("icons-button icons-buttoned");
	})

	function menu($menu) {
		swal({   
			title: $menu.children().text(),   
			text: "特惠袭来，敬请期待",   
			// type: "success",   
			showCancelButton: false,   
			confirmButtonText: "确认",   
			closeOnConfirm: false,
			cancelButtonText: "取消"
		 })
	}

	$('.feedback-main .banner').click(function(){
		window.location.href = "demo.html";
	});

	//参数为要显示城市和详细地址的div#id,string格式
	function showLocation(city, detail) {
		var point = null,
			geolocation = new BMap.Geolocation(),
			address,
			// city,
			$detail = '#' + detail + ' span',
			$city = '#' + city + ' span';  
		  
	 	geolocation.getCurrentPosition(function(result){
	 		if(this.getStatus() == BMAP_STATUS_SUCCESS){ 
	 			point = result.point;
	 			var Geo = new BMap.Geocoder();
				Geo.getLocation(point, function(re) {
					if(re) {
						addressComponents = re.addressComponents;
						city = addressComponents.city;
						address = addressComponents.street + addressComponents.streetNumber;
						$($city).html(city);
						$($detail).html(address);
					}
					
				})
			
	 		}
	 	});
	 }

	//提交反馈
	$('#btn-feedback').click(function() {
		var data = $('.feedback-content textarea').val(),
			datas = {
				content: data,
				openid: getQueryString("openid")
			};

		if (data!="") {
			$.ajax({
				type: "POST",
				url: "feedback/insert",
				data: datas,
				dataType:"json",
				success: function(result) {
					$("area").val(""); 
					var result = JSON.parse(result);
					if(result.retCode==0){
						setTimeout(function() {     
							swal({
								text: '多谢您的建议和意见！我们会尽快处理并与您联系',
								confirmButtonText: '完成',
								confirmButtonColor: '#ffb700'
								},
								function(isConfirm) {
									window.location.href = "demo.html";
								}
							);   
						}, 1200);
					}else {
						swal({
							text: '提交失败',
							confirmButtonText: '关闭',
							confirmButtonColor: '#ffb700'
						});
					}
				}
			})   
		}else {
			swal({   
				text: '请输入反馈意见后提交',   
				showCancelButton: false,   
				confirmButtonText: '确定', 
				confirmButtonColor: '#ffb700',  
				closeOnConfirm: false
			})
		}
	});

// })
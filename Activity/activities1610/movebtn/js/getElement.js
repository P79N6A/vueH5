    var  third_party_openid,index_url;
    var aquery = window.location.href.split("?");
    third_party_openid = urlGet()['xjj_openId'];
    index_url=aquery[0];
	if (typeof(third_party_openid) == "undefined") {
	    var _url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8794fd4ba5b3da63&redirect_uri=http://www.szhyweb.com/MMGWEB/OauthServlet&response_type=code&scope=snsapi_base&state="+index_url+"QwechatQ30000019QwechatQactivity_id="+urlGet()['activity_id']+"QwechatQopenid="+urlGet()['openid']+"#wechat_redirect";
	    window.location.href = _url;
	}else{
		var beacon_msg;
		var btnNum;
	    //获取页面元素的位置及信息
	    $.ajax({
	        type: "GET",
	        url: "data/data.json",  //获取本地的页面配置文件
	        async:true,
	        dataType: "json",
	        success:function(data){
	        	btnNum=data.btn;
	        	beacon_msg=data;
	        	$("#bgimg").attr("src",data.bg_src);   //给页面添加背景图
                for(var i=0;i<btnNum.length;i++){      //循环有多少个点击按钮
                	var warp=document.getElementById("warp");            //获取父元素DOM
                	var Odiv=document.createElement("div");             //创建一个div
			        var Oimg=document.createElement("img");          //创建一个img
			        Odiv.className="btn";        //div的class为btn
			        Oimg.className="gift";      //img的class为gift
			        Oimg.setAttribute('item_id',btnNum[i].item_id);   //创建一个标签属性
			        Odiv.style.width=btnNum[i].width/100+"rem";     //获取按钮元素的宽度
			        Odiv.style.height=btnNum[i].height/100+"rem";   //获取按钮元素的高度
			        if(!btnNum[i].left && !btnNum[i].right){   //if 判断 左右位置
			        	Odiv.style.left=btnNum[i].left+"%";
			        	Odiv.style.right=btnNum[i].right+"%";
			        	Odiv.style.margin="0 auto";
			        }else if(btnNum[i].left && !btnNum[i].right){
			        	Odiv.style.left=btnNum[i].left+"%";
			        }else if(!btnNum[i].left && btnNum[i].right){
			        	Odiv.style.right=btnNum[i].right+"%";
			        }else{
			        	Odiv.style.left=btnNum[i].left+"%";
			        	Odiv.style.right=btnNum[i].right+"%";
			        	Odiv.style.margin="0 auto";
			        }
			        Odiv.style.bottom=btnNum[i].bottom+"%";  //按钮距离底部的位置
 	                Oimg.src=btnNum[i].src;      //获取按钮的背景图
			        Odiv.appendChild(Oimg);     //在div内添加一个img
			        warp.appendChild(Odiv);    //在warp内添加一个div
                }
	      	},
	      	error:function(data){
	      		alert('获取页面元素失败，请重新再试');
	  		}
		});
		$(document).on("click",".gift",function(){
            var getCoupon = {};
            getCoupon.activity_item_id = $(this).attr("item_id");
            getCoupon.activity_id = urlGet()['activity_id'];
            getCoupon.openid = urlGet()['openid'];
            getCoupon.third_party_openid = third_party_openid;
		    getCoupon.third_party_name = beacon_msg.third_party_name;
            $("#loadingToast").show();
            $.ajax({
                type: "POST",
                url: beacon_msg.ajax_url,
                data: getCoupon,
                dataType: "json",
                success: function(data){
                    $("#loadingToast").hide();
                    if(data.return_code!=200){
                        alert(data.return_msg);
                    }
                    else{
                       if(urlGet()['subscribe'] == 1){
		            		window.location.href = 'http://ab.aikaka.com.cn/Coupon/show_webcoupon' + "?coupon_code=" + data.data.coupon_code;
		            	}else{
		            		window.location.href = 'http://t.cn/RcBraHp';
		            	}
                    }
                },
                error :function(data){
		     		$("#loadingToast").hide();
		      		alert('请在网络畅通的环境下，重新再试'); 
		  		}
            });
        });
	}
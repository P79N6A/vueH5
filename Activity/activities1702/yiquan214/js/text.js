
$(document).ready(function () {
　　if(sessionStorage.tex_info){
            var tex_info = JSON.parse(sessionStorage.tex_info);
            $(".myname1").html(tex_info.myname);
            $(".myphone1").html(tex_info.myphone);
            $(".Taname1").html(tex_info.Taname);
            $(".Taphone1").html(tex_info.Taphone);
      }else{
         my_alert("confirm_error", "加载失败","信息加载失败","请再试试吧！",["知道啦"],["#000000"],function(){
             WeixinJSBridge.call('closeWindow');
         })
      }
})
      
	
	

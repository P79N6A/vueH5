/*
* 全局变量
*/
var screenHeight = window.innerHeight;
var screenWidth = window.innerWidth;


/*
* 弹出提示信息
* 参数：弹出外层id,消失时间
*/
var popup = function(ele, time) {
	var $popup = document.getElementById(ele);

	$popup.style.display = "block"; 
	if($popup.style.display == "block"){
		setTimeout(function(){$popup.style.display = "none"},time);
	}
};


/*
* container最大宽度
*/
var containerMaxWidth = function (){
    var maxWidth = 640;
    var width = maxWidth - document.documentElement.clientWidth * 0.1 + 'px';
    $('.container').css('max-width',width);
};


/*
* 刷新
*/
function refresh()
{
	var url = window.location.href;
	if(url.indexOf('?')>0){
		var target = window.location.href+"&_t="+new Date().getTime();
	}else{
		var target = window.location.href+"?_t="+new Date().getTime();
	}
    window.location.href = target;
}

/*
* 电话验证
*/
function checkPhone(phone) {
    if (phone != '') {
        var pattern=/^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
        if(pattern.test(phone) == false) {
            return false;
        } else{
            return true;
        }
    }
}

/*
* ele一屏
*/
function eleHeight(ele){
    var $ele = '.'+ele;
    $($ele).css('height', screenHeight);
}

/*
* input:focus加框
*/
function fucus(ele) {
	var $ele = '.'+ele+' input';
}

/*
* reset
*/
$('#resetBtn').click(function() {
    $(this).parent().siblings().find('input').val('');
});



// /*
// * 弹出提示信息
// * 参数：弹出外层id,消失时间
// */
// var popup = function(ele, time) {
//     var $popup = document.getElementById(ele);

//     $popup.style.display = "block"; 
//     if($popup.style.display == "block"){
//         setTimeout(function(){$popup.style.display = "none"}, time);
//     }
// };
// 

/**
 * 元素高度占据一屏
 * @param  {string} $ele [需要占据一屏的元素]
 * @return {[type]}      [description]
 */
function singleScreen($ele) {
    $($ele).css({'height': screenHeight+'px','overflow': 'hidden'});
}

/**
* url get parameters
* @public
* @return array()
*/
function urlGet()
{
    var aQuery = window.location.href.split("?");//取得Get参数
    var aGET = new Array();
    if(aQuery.length > 1)
    {
        var aBuf = aQuery[1].split("&");
        for(var i=0, iLoop = aBuf.length; i<iLoop; i++)
        {
            var aTmp = aBuf[i].split("=");//分离key与Value
            aGET[aTmp[0]] = aTmp[1];
        }
    }
    return aGET;
}

/**
 * realityH(oriP, oriH)
 * @method 根据设计图原始比例展示在页面上
 * @param  {[Number]} oriP [设计图上高度]
 * @param  {[Number]} oriH [设计图总高度]
 * @return {[Number]}      [页面上高度]
 */
function realityH(oriP, oriH) {
    var out;
    out = screenHeight*(oriP/oriH);
    return out;
}







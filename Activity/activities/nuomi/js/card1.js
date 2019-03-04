//定位
var screenH = $(window).height(),
	screenW = $(window).width(),
	bgH = 1214,
	bgW = 750,
	sc = bgW/bgH,
	h,
	b1 = screenH*853/bgH,
	b2 = screenH*662/bgH,
	b3 = screenH*470/bgH,
	t = screenH*237/bgH,
	bottom = screenH*380/bgH,
	screen_sc = screenW/screenH,
	btnH = screenH*100/bgH;

if(screen_sc > sc){
	h = screenW/sc;
	b1 = 853*screenW/bgW;
	b2 = 662*screenW/bgW;
	b3 = 470*screenW/bgW;
	t = 237*screenW/bgW;
	bottom = 380*screenW/bgW;
}else {
	h = screenH;
}
$("#card").css({'height':h+'px','width': screenW+'px'});
$(".bg-img").css({'height':h+'px','width': screenW+'px'});
// $(".btn-common").css({'bottom':bottom+'px','height': btnH+'px'});

$(".btn1").css({'bottom': b1+'px','height': btnH+'px'});
$(".btn2").css({'bottom': b2+'px','height': btnH+'px','display':'block'});
$(".btn3").css({'bottom': b3+'px','height': btnH+'px','display':'block'});

var cw = $("#content").width();

$("#content").css({'top': t+'px', 'left': (screenW-cw)/2 +'px'});
$(".btn-common").css({'bottom':bottom+'px','height': btnH+'px'});


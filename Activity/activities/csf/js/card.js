//定位
var screenH = $(window).height(),
	screenW = $(window).width(),
	bgH = 1208,
	bgW = 750,
	sc = bgW/bgH,
	h,
	bottom = screenH*95/bgH,
	screen_sc = screenW/screenH,
	btnH = screenH*120/bgH;

if(screen_sc > sc){
	h = screenW/sc;
}else {
	h = screenH;
}
$("#card").css({'height':h+'px','width': screenW+'px'});
$(".bg-img").css({'height':h+'px','width': screenW+'px'});
$(".btn-common").css({'bottom':bottom+'px','height': btnH+'px'});
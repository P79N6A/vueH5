$(window).bind('orientationchange', function(e) {
    orient();
});
function orient() {
	$('#mask_box').remove();
	var mask=$('<div id="mask_box" style="width:100%;height: 100%;position: absolute;left: 0;top: 0;z-index: 99999;display:none;background:white;line-height:100%;text-align:center;color:#234567;font-size:0.4rem;"><img style="width:3rem;height:2rem;" src="http://www.vsread.com/iconograph1/77a85d6bbe4bfe1b64219229a27bbd59.gif"><br>为了更好的视觉效果,请竖屏查看！</div>');
     $('body').append(mask);        
    if (window.orientation == 0 || window.orientation == 180) {
        $('#mask_box').css("display","none");
        return false;
    } else if (window.orientation == 90 || window.orientation == -90) {
        $('#mask_box').css("display","block");
        return false;
    }
}

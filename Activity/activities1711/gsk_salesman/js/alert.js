//使用方法 直接在页面调用下面的一行代码
//			my_alert("confirm_correct", "标题","副标题",["知道了"],function(){ })
//			my_alert("confirm_error", "标题","副标题",["知道了"],function(){ })
//			my_alert("select", "标题","副标题",["取消","确定"],function(){ })
//			my_alert("abnormal", "网络开小差了...","副标题",["知道了"],function(){ })  


//适配移动端将px 转化为rem;
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=750){
                docEl.style.fontSize = '100px';
            }else{
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

function my_alert(type, text,inte,desc,btn_array,btn_color,objright,objleft){
			var data = {
		        type:type,
		        text:text,
		        inte:inte,
		        desc:desc,
		        btn:btn_array,
                color:btn_color
		    };
		    var alertBox = alertFn(data);
		    $('#alert_box').remove();
		    $('body').append(alertBox);
		
		    alertBox.show(); //在固定的位置直接使用
		    alertBox.find('#alert_confirm').on('click',objright);
            alertBox.find('#alert_cancel').on('click',objleft);
		    alertBox.find('#alert_confirm').on('click',function(){
		    	alertBox.hide();
		    });
            alertBox.find('#alert_cancel').on('click',function(){
                alertBox.hide();
            });
}

var alertFn = function(o){
    var o = o || {};
    var centerCon = ''; //中心内容
    var centerBtn = ''; //按钮选择
    var alertAll = '';
    if(o.type&&o.type=='confirm'){
        centerCon = '<div style="font-size:20px;color:black;padding:30px 12px 8px 12px;line-height:140%;"><span style="font-size:20px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEyMjVBN0NGRDE4ODExRTY4REVGQkIwQUI1NzU0ODQzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEyMjVBN0QwRDE4ODExRTY4REVGQkIwQUI1NzU0ODQzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTIyNUE3Q0REMTg4MTFFNjhERUZCQjBBQjU3NTQ4NDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTIyNUE3Q0VEMTg4MTFFNjhERUZCQjBBQjU3NTQ4NDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6zmssZAAADnUlEQVR42tybwU8TQRTGH1RtLUTQJSWIXDCIImlIwFgv3rx40qgH4YQJ4cBdxXg0KH8Alx4MB9CDGg8kXrxxsYkSiQmVpKQhESQQNkgCSG1peG/7toGyLW13Zt3Ol3zpZLM77/12N7szr7NVU1NTIFi16B52EH0B3YyuR/t4n130H/Qyegn9A/2NvSUymROC+jmFfoC+h76J1o7Z/ww6gL6Us11HT6M/oN+h/9lNrNrm8efRI+g4egJ9twi4QtK4jwnuc4RjOA7oR7/kJIb5FhStZu47zrH8TgHSbTiPfor2gnx5OdY8x5YKGEa/R7eA82rh2GEZgE38hBuA/68BzqVJFOAV9Hd0N7hH3ZzTZbuAbeiv6EZwnxr5SraVC0iP7C/oGnCvajhHrRzAaZvvNKekca4ljWReoztEZtHQ0ABdXV1Ge3Z2FtbX10V238E5PyrmCt5G94s+zcFgEHw+n2FqS1A/514QkK7opIzofr/fsi1Yk7l3ZS7gCx71V6rqmcES8Cz6CVS+iOGcFaAKcKYe5wKeRA8pBDjETFnAOzwTV0W1PK/MAvaCenpoAtJ865aCgMTkJcCQy8ebdsapIRNQVV0nwKsKA3YSYKvCgK0EGFAYMECAdQoD1hHgaYUBfdWguAjwr8J8uwS4qTDgJgGuKQy4RoBxJyKl02nLtmTFCXDOiUiLi4uWbcmaowJNxIlI0WgUVldXjbau604BRkzAbSdmFA6CATNF6BZNoD8r+IAhpoT5on+rIKDBZBZJP0JmdYO0uozH4zHK9yQq2+/t7cmE22KmLGASPQaSSodUyQ6FQtmK9s7ODkQiEeNXksaY6VBddFTarLOz80jpnrZJ1OjBsaipDVmQ5q15UJqmyYTbsAIkPZcxNk0mk0e2pVIpKWNPZoB8gBRVeI3UauQiaTTTywx5AUmf0OMioy4sLEAsFjOuJJnatE2wxjn3Q6oqsBiPxqgdUBmKQp7qYKEZPS2q0ysATudcoVRAOvAGj+ncqm3OUS8HkBRDX3PppJhy6uEcoVxA0k80LY+YcRHcDOc0f9yOxVbVVvhshV0AF+ZcVorZudSy4SD6PmSWITutJY49WMpB5dRFablxOw+JEg6AJThWO8cG2YDGhAAyi1TpjxtajbssAYz6fIW+yLHKmnrYrWz/Rj9j0D6eg9l5d+rcRx/3OWz35IladU+r49+wcz8roJW6tP6a/uQ5+FnBJif/CyR+VrAvwAAQ5NpIh5URWwAAAABJRU5ErkJggg==) no-repeat left; background-size: 22px 22px;padding-left:30px">'+o.text+
                    '</span></div>'+'<div style="font-size:13px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">'+o.inte+'</div>'+
                    '<div style="font-size:13px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all">'+o.desc+'</div>';
        centerBtn = '<div style="display:table;width:100%;table-layout:fixed;padding:7px 0;border-top:solid 1px #e4e4e4;">'+
                    '    <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:18px;height:30px;border-left:solid 1px #e4e4e4;color:'+o.color[0]+';" id="alert_confirm">'+o.btn[0]+'</div>'+
                    '</div>';
    }else if(o.type&&o.type=='select'){
        centerCon = '<div style="font-size:20px;color:black;padding:30px 12px 8px 12px;line-height:140%;"><span style="font-size:20px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZERTdFM0UwRDE4NjExRTY4NjAyRURERjIwRjY5OEVFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZERTdFM0UxRDE4NjExRTY4NjAyRURERjIwRjY5OEVFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkRFN0UzREVEMTg2MTFFNjg2MDJFRERGMjBGNjk4RUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkRFN0UzREZEMTg2MTFFNjg2MDJFRERGMjBGNjk4RUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6V7dqwAAAGq0lEQVR42tyb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) no-repeat left; background-size: 20px 20px;padding-left:30px">'+o.text+
                    '</span></div>'+'<div style="font-size:13px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">'+o.inte+'</div>'+
                    '<div style="font-size:13px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all">'+o.desc+'</div>';
        
        centerBtn = '<div style="display:table;width:100%;table-layout:fixed;padding:7px 0;border-top:solid 1px #e4e4e4;">'+
                    '    <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:18px;height:30px;color:'+o.color[0]+';" id="alert_cancel">'+o.btn[0]+'</div>'+
                    '    <div style="display:table-cell;vertical-align:middle; color:red; text-align:center;font-size:18px;height:30px;border-left:solid 1px #e4e4e4;color:'+o.color[1]+';" id="alert_confirm">'+o.btn[1]+'</div>'+
                    '</div>';
    }else if(o.type&&o.type=='select_one'){
        centerCon = '<div style="font-size:20px;color:black;padding:30px 12px 8px 12px;line-height:140%;"><span style="font-size:20px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZERTdFM0UwRDE4NjExRTY4NjAyRURERjIwRjY5OEVFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZERTdFM0UxRDE4NjExRTY4NjAyRURERjIwRjY5OEVFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkRFN0UzREVEMTg2MTFFNjg2MDJFRERGMjBGNjk4RUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkRFN0UzREZEMTg2MTFFNjg2MDJFRERGMjBGNjk4RUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6V7dqwAAAGq0lEQVR42tyb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) no-repeat left; background-size: 20px 20px;padding-left:30px">'+o.text+
                    '</span></div>'+'<div style="font-size:13px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">'+o.inte+'</div>'+
                    '<div style="font-size:13px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all">'+o.desc+'</div>';
        
        centerBtn = '<div style="display:table;width:100%;table-layout:fixed;padding:7px 0;border-top:solid 1px #e4e4e4;">'+
                    '    <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:18px;height:30px;border-left:solid 1px #e4e4e4;color:'+o.color[0]+';" id="alert_cancel">'+o.btn[0]+'</div>'+
                    '</div>';
    }else{
        centerCon = '<div style="font-size:16px;color:#f00;padding:50px 0 38px;">请输入必填参数type！</div>';
        centerBtn = '';
    };
    alertAll  = $('<div style="display:none;overflow:hidden;" id="alert_box">'+
                '    <div style="position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.54);z-index:10000;" id="alert_bg"></div>'+
                '    <div style="width:80%; position:fixed;top:50%;left:50%;z-index:10001;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);">'+
                '        <div style="overflow:hidden;background:#fff;border-radius:10px;margin-top:-36px;">'+
                '            <div style="width:100%;text-align:center;">'+centerCon+'</div>'+centerBtn+
                '        </div>'+
                '    </div>'+
                '</div>');
    return alertAll;
};
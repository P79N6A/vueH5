var alertFn = function(o){
    var o = o || {};
    var centerCon = ''; //中心内容
    var centerBtn = ''; //按钮选择
    var alertAll = '';
    if(o.type&&o.type=='prompt'){
        centerCon = '<div style="padding-bottom:12px;">'+
                    '    <div style="font-size:20px;color:#474747;padding-top:46px;">恭喜你</div>'+
                    '    <div style="font-size:16px;color:#707070;padding:12px;line-height:140%;">'+o.text+'</div>'+
                    '    <div style="font-size:20px;color:#fda626;padding-bottom:18px;">+ '+o.inte+'</div>'+
                    '    <div style="font-size:12px;color:#707070;">'+o.desc+'</div>'+
                    '    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAgVBMVEUAAADk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OQ3BO7YAAAAKnRSTlMACr4C67l3LfBVGeQUmK/py7Ee2dKdkU4ptKihjYh+SkUxBfeVXBHCXz4g4RM+AAABqklEQVRIx6WW6XaCMBCFRzAYdhC0biButd73f8DaVhrCRCTH+zPnfFlmbmaGuAJ/ty5CKcNivbsE9FKBVwKQmUgSkUkApTcfBFZbII39QB0Yh8Bm9hT4jIH13tUX3SYBFpGZ+JhCHIxn55A+cblLpO063y3E+dhfnORwBqITCYhJj3Cw0B/BL5FpjJuj0gmuGqJ7tx0/g2uJuPM6OK8JcgX8/3ykaUAjFIWyzU+s6GHtsX1kCoJGKsdfrrc4jEVW2PxaD4JGK8GPrz3su2GpZr0kx11LNqiJKEuP2tp01rNF3N0xLIgiLKgr785ohKP55Iw5+bgQYzihsv5F1R3jzDOCIiwpOblkYhShSwoqSyIjYyYoKyh0yMyYCVpPSeZkZq5GgjanJwjVwFURGsIv1saqjRu/WFmaCac2M1nBgqyi6xkZKVQqmUseDEulMgwjFKMbRtmSEYrRbanMzwnF6OZXX4wTnGlQs498Oz0IxVT6R+bl4tbPeeOycmFblOxLn32BtS/j7zQLchPLlmTf+Ozbq30Ttx8V7AcS89gz52PP+8MVH+HyoRHuGz0mK5WfTrqvAAAAAElFTkSuQmCC" alt="关闭" style="position:absolute;top:-20px;right:0;width:24px;height:24px;" id="alert_shut">'+
                    '</div>';
        centerBtn = '';
    }else if(o.type&&o.type=='confirm_correct'){
        centerCon = '<div style="width:1.46rem;height:1.46rem;margin:0.54rem auto 0.36rem;"><img style="width:100%;height:100%;" src='+o.imgsrc+'></div>'+'<div style="font-size:0.32rem;color:#666;margin-bottom:0.5rem;">'+o.text+
                    '</div>'+'<div style="font-size:12px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">'+o.inte+'</div>'+
                    '<div style="font-size:12px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all">'+o.desc+'</div>';
        centerBtn = '<div style="display:table;width:100%;height:1.14rem;table-layout:fixed;border-top:solid 1px #e1e1e1;">'+
                    '    <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:0.34rem;height:1.14rem;border-left:solid 1px #e4e4e4;color:#333;" id="alert_confirm">'+o.btn_text[0]+'</div>'+
                    '</div>';
    }else if(o.type&&o.type=='confirm_error'){
        centerCon = '<div style="width:1.46rem;height:1.46rem;margin:0.54rem auto 0.36rem;"><img style="width:100%;height:100%;" src='+o.imgsrc+'></div>'+'<div style="font-size:0.32rem;color:#666;margin:0 0.3rem 0.5rem;">'+o.text+
                    '</div>'+'<div style="font-size:12px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">'+o.inte+'</div>'+
                    '<div style="font-size:12px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all">'+o.desc+'</div>';
        centerBtn = '<div style="display:table;width:100%;height:1.14rem;table-layout:fixed;border-top:solid 1px #e1e1e1;">'+
                    '    <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:0.34rem;height:1.14rem;border-left:solid 1px #e4e4e4;color:#333;" id="alert_confirm">'+o.btn_text[0]+'</div>'+
                    '</div>';
    }else if(o.type&&o.type=='select'){
        centerCon = '<div style="width:1.46rem;height:1.46rem;margin:0.54rem auto 0.36rem;"><img style="width:100%;height:100%;" src='+o.imgsrc+'></div>'+'<div style="font-size:0.32rem;color:#666;margin-bottom:0.5rem;">'+o.text+
                    '</div>'+'<div style="font-size:12px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">'+o.inte+'</div>'+
                    '<div style="font-size:12px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all">'+o.desc+'</div>';
        
        centerBtn = '<div style="display:table;width:100%;height:1.14rem;table-layout:fixed;border-top:solid 1px #e1e1e1;">'+
                    '    <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:0.34rem;height:1.14rem;color:#333;" id="alert_cancel">'+o.btn_text[0]+'</div>'+
                    '    <div style="display:table-cell;vertical-align:middle; color:red; text-align:center;font-size:0.34rem;height:1.14rem;border-left:solid 1px #e1e1e1;color:#333;" id="alert_confirm">'+o.btn_text[1] +'</div>'+
                    '</div>';
    }else{
        centerCon = '<div style="font-size:16px;color:#f00;padding:50px 0 38px;">请输入必填参数type！</div>';
        centerBtn = '';
    };
    alertAll  = $('<div style="display:none;overflow:hidden;" id="alert_box">'+
                '    <div style="position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.3);z-index:10000;" id="alert_bg"></div>'+
                '    <div style="width:6rem; position:fixed;top:50%;left:50%;z-index:10001;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);">'+
                '        <div style="overflow:hidden;background:#fff;border-radius:10px;">'+
                '            <div style="width:100%;text-align:center;">'+centerCon+'</div>'+centerBtn+
                '        </div>'+
                '    </div>'+
                '</div>');
    alertAll.find('#alert_bg,#alert_cancel,#alert_shut').on('click',function(){
        alertAll.hide();
        return false;
    });
    return alertAll;
};

// 截取链接地址字符js
function urlGet() {
    var aQuery = window.location.href.split("?"); //取得Get参数
    var aGET = new Array();
    if (aQuery.length > 1) {
        var aBuf = aQuery[1].split("&");
        for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
            var aTmp = aBuf[i].split("="); //分离key与Value
            aGET[aTmp[0]] = aTmp[1];
        }
    }
    return aGET;
};
// 弹出键盘时保证屏幕高度不会塌陷;
$(document).ready(function() {　　
    $('body').height($('body')[0].clientHeight);
});

//时间戳转化成日期
function timechange(nS) {
    var d = new Date(parseInt(nS));
    var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":00:00";
    if (d.getMonth() < 9) {
        if (d.getDate() < 10) {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-0" + d.getDate() + " " + d.getHours() + ":00:00";
        } else {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":00:00";
        }
    } else {
        str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":00:00";
    }
    return str
};
// 验证只能输入中文数字和子母
function c_n(text) {
    var d = text.trim();
    var regExp = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g;
    if (d != "") {
        if (d.match(regExp)) {
            return false
        } else {
            return true
        }

    } else {
        return false
    }
};
// 手机号码验证
function telphone(number) {
    var d = number.trim()
    if ((/^1[34578]\d{9}$/.test(d))) {
        return true
    } else {
        return false
    }

};
// 身份证验证
function idCard(idcard) {
    var d = idcard.trim()
    if ((/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(d))) {
        return true
    } else {
        return false
    }

};
// 邮箱验证
function e_mail(mail) {
    var d = mail.trim()
    if ((/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(d))) {
        return true
    } else {
        return false
    }

};
// 组织冒泡
function stopBubble(e) {
    e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation(); //W3C阻止冒泡方法  
    } else {
        e.cancelBubble = true; //IE阻止冒泡方法  
    }
};
// 数组去重
var unique = function(arr) {
    var result = [],
        json = {};
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!json[arr[i]]) {
            json[arr[i]] = 1;
            result.push(arr[i]); //返回没被删除的元素
        }
    }
    return result;
};
// 判断数组元素是否重复
var isRepeat = function(arr) { //arr是否有重复元素
    var hash = {};
    for (var i in arr) {
        if (hash[arr[i]]) return true;
        hash[arr[i]] = true;
    }
    return false;
};
// 获取数组的最大值
function get_max(arr) {
    var maxInNumbers = Math.max.apply(Math, arr);
    return maxInNumbers
};
// 获取数组的最小值
function get_min(arr) {
    var minInNumbers = Math.min.apply(Math, arr);
    return minInNumbers
};
// 取随机整数
function num(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// 横屏友好提示js
$(window).bind('orientationchange', function(e) {
    orient();
});
orient();

function orient() {
    $('#mask_box').remove();
    var mask = $('<div id="mask_box" style="width:100%;height: 100%;position: absolute;left: 0;top: 0;z-index: 999;display:none;background:white;line-height:100%;text-align:center;color:#234567;font-size:0.4rem;"><img style="width:3rem;height:2rem;margin-bottom:0.2rem;" src="data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCACoANgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAK+E/wDgpJ8V9U8Oa94C8OaJqdzpd5AJtakmtJmikVs+VCQykEY/f/nX3ZX5Qf8ABQLXW1f9qbWrRm3LpWm2dqo9A0fmn9ZDXTh43qETdkfSH7J37bsvi/UrbwP8R5EtfEDMILLV3URLdP08qZeAkmeARgMeMBsbvs+vze/a7+CsN98K/Anxg0K32G80mwTWRCMAs8CeVcHHQ5wjH1Ke5r6A/Yd/aVf4weEX8M+ILrzPF2iRDMsjfNfW3CrL7upwreuVPVjiqtNOPtIfMUX0Z9Q0UUVyGgUUV4Z+01+1ToX7Pejrbqiav4tu4y1npQfAReglmI5VM9B1YjAxyRUYuTshN2PbJ762tZreGa4ihluXMcMcjhWlYKWKqD1O1ScDsCe1T1+RXgT40+L/AB5+0p4E8WeJdVuL+4Ou2sCk/LDDE8qq8cSj5VG1zwOucnJOa/XWtKlJ07JijLmCiiisSgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvx6/bPkaT9rX4g7uubUD6CBR/hX7C1+RX7dumtpn7XXixiMJeWlpOnuBbxKf/Ht1deF+Mznsfff7PWn6V8Xv2Q/DeiX6mfTr3Rm0mcEcrs3Qkj0KlMg9iBX5taHrPiL9mf43+fHlNY8N6i8E8WSqXCKxV0P+xImefRgR2r7W/4Jt/EJNT+G+q+Fppsz6Tel44z/AAwzDcv/AI+JvzFeU/8ABSf4YjQfiJo3jS1h222u2/2e6ZRx9phAAJ/3oygH/XM1pSfLUlTf9f0iqkbJSX9f0z9BvB3izTvHfhXSvEOkTefpupWyXMD99rDOCOxHQjsQRWzX5/fsGftN6B4H8Ga34R8a65b6RY2En23TJ7tiAUc/vYlx3DYcAcne/pX0zp/7ZXwY1K6+zw+O7JJM4zcQTwp/328YX9a5p0pRk0kCkmjR/aS+PWnfs/8Aw7n1mZUutYuSbfS7Bj/r5sdWxzsQfMx+gzlhX5VaNp/ij9oX4sQW813JqXiLXrvM13PyFGMs5A6IiAnaOgUADoK6v9q/42y/HD4t6jqME7PoGnk2OlR5+XyVPMmPWRst64Kj+Gvor/gm58MYvK1nxvdRZnml/s6zLKRtjQK8rDsQzGNc9vLYdzXXb6vS5urCEfazt0RsftEfCPQPg94e+BPh/QrURC38UweZMQPNuJWMe+Rz3YlV9gAAMAAV9v18n/tkXIvvjJ+z3oinJm8SLcyKOyrPbAH8mf8AKvrCuSbbhG/mC3YUUUViUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV+Yv/BTPR7eL48+HNTtLiCWeXRxDeW6SKZIiHk2s65yMgpjPXBr6Q/bK/a7/AOFN2zeEvCkscvjO6iDTXBAddNjYcMR0MjDlVPAGGI5AP5m6nql5reo3F/qF1NfX1y5lmubiQvJI55LMx5JPqa78PSd+dmU5LY6D4c/FDxL8J9bm1bwvqR02+lga2d/LWQMjYPKsCMghSDjqPrWZ4l8X654z1B77XtYvtZvHOTNfXDzN+BYnA9hWRRXocqve2pnd2sFFFFMkK9f+Cf7U3jr4GPDbaPexX2iI5dtIv03wncctsbho88n5SBk5INeQUVMoqStJFJtbH23Z/HPT/wBpv9rL4MX2n2M+nCwhZrmzuGDeVcJ50rBWH3l2xxkNgdegIr9C6/DPwdpHiDWvEdlb+F7TULzXVfzbaPSkd7hWT5tybPmBGM5HTFfpv+xz+0refFzSr7wn4uVrXx5oQK3CzR+U91Ep2mQoQNsithXXA5IPcgefiKVknHZGkJdz6VooorhNQooooAKKKKACiiigAooooAKKKKACiiigAooooAK4z4xfEi0+Efwz8QeLLtRIunWxeKFjjzZmIWJP+BOyj2BJrs6+L/8Agpv4vk0/wB4R8NxvtGp38t3KAeWWBAAD7bpgfqo9K0px55qIm7K5+ffiXxHqPi7xBqOt6tcvealfzvcXE79Xdjk/Qeg7Dis2iivcOUKKKKACiiigAqvdXq2xCiKaeQ9EhQsasV+h3/BOqz0KX4Wa1cQW1v8A28mqPHdzlQZvKMaGMZ6hPv4HTIasqs/Zx5ikrux8o/sa/GzSvhH8bdP1fXLea10u6gk0+5mmjOYEkKkSjHUBlXOOdpbg9K+of2nbOD4I/tF/Dz4z6FIg0fWpkh1SS3YGKUbQrvkcHzIHJB9Y93U19F+PPgz4P+JFlNb69oNlftKpXz5YR5y57rKPnU+6kV8tfGzwrceH/wBlnxt4E1G6fUf+EB1yyudLupjlzY3OBCrHuV86ZOwwowAK41UVSSfyZpZpH38DkZHIpa5z4cX76p8PPC97Kd0lzpVrMxPctCpP866OuF6GoUUUUgCiiigAooooAKKKKACiisPxl430H4e6DPrXiTVbbR9Mh+9cXT7QT2VR1Zj2UAk9hRuBuUV8JfFb/gpfHBNNZfDzw+tyqkqNV1rIVvdIFIOPQsw91r5s8UftifGDxZK7XHje/sYyeItLCWYUegMYDH8STXVHDTlq9CHNI/YCivxNk+NnxEmkMj+PfE7yE5LNrFwT+e+tvRv2nvizoLq1r8QtfkK8gXl61yv5S7hWn1WXcnnR+y9fnp/wVAkc+L/AkZJ2LY3LAe5kTP8AIVw/hb/goD8W0QWF5f6ZqDyYUXk+nosynI5Gzan5qa4/9pD4y678aLDw3ca9Ba/btJ8+E3dsmzzkk2FQy9AVKNyODuHAxk+X9do4bHQwdV2lLbt6H0dLIsbissqZrRSdODs9dV527fO/W1jwyiiivpj5YKKK91/ZB/Z+T49/Eswaksg8MaQi3WpMhKmUE4jgDDoXIOT12q2CDiplJRV2NK55V4a+HvinxnHJJ4f8NaxrscZw7abYS3AU+5RTisjUdNvNHvZbO/tZ7K7iO2SC5jMciH0KkAiv3Q0XRNP8OaVbaZpVlBp2n2yCOG1toxHHGo7BRwK5D4sfA/wb8atGaw8UaRFdSBSsF/EAl1bH1jkAyOedpyp7g1xLFa6rQ05D8WbaBrq4jhQoHkYIpkcIuTwMsSAB7k4FekfDD4o+Mv2bPHUt1a20tlc4EV9pOoxMiXEfUBlOCD3VhyM9wSD6Z4u/Yk8ReCvjBZeHrmV7zwndbrmLW4k25gQjdGw52y/Mq45HzBhkZA+s9P0bwvc+HrPw/r3hzTtc0WyiWC0tr62SX7PGONsbEblOO4avWp4aeIpOpBXX5njYnMqGErRo1Hq/w9Tze0/4KSeE20oSXPhLWYtS2828UsTw7vTzCQce+yvNfEPxPvvip8APjj41v7RbCPxBq2jaXZ2iPvEf2dhJsDYG47SCTgck8AcV4t8bvFfg/W/E13Y+BfCtnoOlw3EkQlhLyvdKCAjAyMxXOCcLjgivv34b/sh6JqX7Mnh3wJ4uS9tbp5xrV21jN5MsV46sBngglEYJggjK59K8qcYUbO3U9iMnNXPoLwfpLaB4S0TTGGGsrGC2P1SNV/pWvXzvp/w++NPwZUHwz4rg+KPh+L/mB+Jj9nv1UfwxXYyGbp/rMKPSvQvhl8cdE+I97c6NJbXnhvxbZruvPDmsR+TdxD++o6SR+jrkYIzjIrhceq1Nkz0aiiisxhRRRQAUUV4F8d/2zfA3wRmn0ve/iTxNHw2lae4Ahb0mlORH9AGb/Zwc1UYuTtFCbtue+0V+Wfjz/goP8VfFk0iaRc2PhOyY4WLT7dZJdv8AtSShjn3ULXkeqfH74l61IXvPH/iWXJzsGqzIg+iqwA/AV1rCye7I50fqx8f/AI/+Hv2f/CB1bVm+1ajcbk0/So3AlupB/wCgoMjc+OMjqSAfyl+L/wAa/FXxv8TPrHia/abaSLayiJW3tEP8MaZ47ZJyTjkmuV13xLq/ii5S51nVb3VrhE8tJr64eZ1XJO0FiSBkk496za66VFU9epnKVwoooroICiiigCW1l8idHzjB61393ANe0OSNSFaaP5W7K46H8CK87rqfCOrhWNnK2N3KE+vpXwfFGBqThDHUPip/lvf5M/YPD/N6NOrVyjF/w617X7tWa+aORtpjNGdy+XKjFJIz1RwcEH8alq14908+H9bTVUX/AEC9IS4x0jlA4b8R/I1VBBAIOQe9fVZdjYZhhYYiHVa+T6o/O86yurk2Pq4Kr9l6Puuj+a/HQK/UD/gnR4Pi0H4CNrOwfadd1GacyY5McR8lV+gZJD/wI1+X9frH+wbrdpq/7MnhmC2YGTTpru0uFH8Mn2h5MfisiH8a3xXwHjw3PoOiiivKNzxf4say1/4jFmrZhs0C47bzyx/kPwrzvXtN1PWNC1Kw0SMS6xc20sNmhcIDMyEJ8x4HzEcmug8STm58Q6nKxyWuZD+G44p/haYQeJdKkbhRdR5PtuFfpVKn7DCqMekfxt/mfkFar9YxznPrL8L/AOR5V+zP+wHfeCvF1j4q+INzY3Utgwns9Hs2MqiYHKvM5AB2nkKuQTgk8YP29RRX5zOcqjvI/XkktgrwL9tXwbe6r8DvEHifwzZn/hO/DNv/AGlpGo2rtFdwCNg0yxyLhvmiEg28gnHGcV77VbUryDT7Ce4uceSi/MDj5uwUZ6kk4A75qE2thn5h/wDBPr9trxT8RvjXofgjWr+8vrK9s54JW1C5muJZJlV5kmLSSPhhtMZ2BAQwyCQCP1Fr83/2TP2b/Dtr+3b478WaFD/Zml+GmnaPToTuhSa4DJsXjhVzLgf7Ir9IKbi4uzEncKKKKkZ8fftx/tYXHw1gbwJ4Qu/J8S3UQfUL+JvnsIWHyoh7SsOc9VUgjlgR+bkkjzSNJIzPI5LMzHJJPUk1794S/Zu+Kn7TfifUfFaaebSy1a6kun1rWWMEMm9icxjBZ1xwNilRjGRX2d8DP2EvA/wuhgv/ABDDF4y8RD5jNexZtYT6RwnIOP7z5PGRt6V6anToRt1MLOTPzX8M/DHxh40i83QPCuta3FnHm6fp8s6D6sqkCsrX/D2p+FdWuNL1mwuNL1K3IE1pdxmOWMkZAZTyOCD+Nfpr+2P+1PF8DdAj8L+F3i/4TG+g+QoAV02A8CQr03nGEXpxuPAAb8wLq6udUvprm5mlu7y4kMkksrF5JXY5JJPJJJ6963pTlUXM1ZEySWh6l8Hv2f8AVPjV4J8b6j4fkNxr3h37JNFpYxuvIZPO8wL/ALY8tCB35HUivKp4JbWeSGaN4Zo2KPHIpVlYHBBB6EHtX0j+yS/xM+EHxHtfEVl4B8T6p4dvI/supJbaVOwkgJB3oduC6EBh68jjdmvuL4q/sr/DX9oCFNZvtPl07VblA41fTf8ARrh+P+WqMuGI6Heu4YxkYrOVb2crS2KUbrQ/IiivvXU/+CXStcFtO+IhSAnhLrSNzKP95ZgD+QrrPAv/AATR8F6NIs3ijxFqXiWRTkQ20a2UJHowBdz9Q4pvEU11FyM/N6iv2I0r9kf4PaPAsUHgHSpFAxm6V7hv++pGY1leJ/2J/g54ogdG8IRaXMR8txpc8luye4UNsP4qaz+tQ7FcjPyMpyO0bhlOGHIIr7O+Mv8AwTg13w7BPqXw/wBUPiO1QFjpV9tivAPRHGEkPthD6AmvjnU9LvNE1C4sNQtJ7G+t3Mc1tcxmOSNh1VlPIPsa6FKFVWWqJTlTkpLRo6i0urXxbpM2m3wBeRNrj+96MPcda85SO58L6q+i6icgc2056SJ2/wA/hWvFK8EiyRsUdTkEdRWzqC2HjjTBY6iRb3icw3IH3W/+v3H/ANavjvq1TIa8q1BOWHl8SWri+67rv5eh+pSx1HjHBww2KkoY2mrQk9FUX8rfSXa+l/VmHX1r/wAE/vjunw98YX/g3Uzu0vXmWW2JfHl3SgjAzx864HJ6ooHWvkjT9C8Q2kktreaTe3CQdL6C3eSFl9S4GB+P481Nb3EtncRTwSPDPEweOSNirIwOQQR0INfVwrUcZTbpTUl5O5+aVsPWwlR068HGSdmmrH7tWV/b6lbrPbSrLGe47H0I6g+x5qxXxV+y9+1JD8QbO30nU71dO8ZQIEYEhU1BVH31B4LYzlO3JXj7v1Tpnj2JwE1CIwtjmaEFkP8AwH7w57DP1rzZQcHZgnc8i8VWps/EmpwkY23DkfQsSP0IrMjkaKRXQ4ZSCD6Gu1+KlpA+sRalaSxzw3K7HaJgwEiYBBx0OCvHtXEV+k4Sqq2HhPuv+HPx3HUXh8VUpvo/w3R9LafeLqFhbXSfcmjWQfQjNWK5D4Wal9v8KRRMcvau0Jz6feH6HH4Vuap4jsNI3LNMHnUf6iL5pOhI47Zx1OB71+d4il7GrKn2Z+s4Wt9YoQq90maMsqQxvJI6xxoCzOxwFA6kmvLvHnjaAWd3f3En2bRtOie4Z3GCVVSWkOenAOB6Zz1wLGu+IrnXG2N+5tA2VgU53Y6Fj39cdBx1IBr5s+OWv3/xZ8U2HwX8Gy+bqepyK+uXsY3JYWikMwcjoehI/wB1er1lCPM7HS3Y7n9gPw9cz+B/Fnj6/iMV54w1qW6XPeGNmAP/AH8eYfhX1LWR4Q8K6f4H8LaV4f0qLyNO022jtYEPXaoABJ7k9Se5JNa9E5c0mwSsgoooqBiKoRQqgKoGAB0Fcp8VfiHY/Cj4ea74r1EbrfTLYyiLODLIcLHGD6s5VfxrrK+RP+Clus3Vl8GtC0+AssF7rKGcr0KpFIQp9txB/wCAitKceaSQm7K58Y/D/wAD+K/2s/jPcme6Zr3Urg3ep6kyFktoycEhc9hhVTPQAcAEj9OvhB+zf4D+ClhDHoGiwyakqgSaveKJbuU9zvI+QH+6mB7V8p/8E7rzStM8Na1eKRJq0Wp5uYYyPMMHkbYuvbc0xHuDX3TaeI9Mvdgivod78rG77H/75OD+lb15ty5FsiIrS5pUVXutRtLBd1zdQ26+ssgUfrWdc+L9Jtto+2LMXGVMAMgP/AlBA/EiuQ0NmivHPiD+1H4N+HIH9salbWEmAfs80u+56/8APGMM2CP4ugroPBHxz8MePNOS90y9hvLcgl5bKUTrH6BgMOG9iuarldr2Fc9DorKi8U6RLEj/ANo28Qf7oncRMf8AgLYP6Vow3EVwm+KVJF/vIwIqRkleJ/tG/sseGf2gNHeWVE0nxVDHi01mJPm46RzAffT9V7HqD69ca7pto+yfULSF/wC7JOqn9TWZqXjvR9Mind7hpPJG59i4XHc72wv61UW4u6E1c/JT4ofsr/Ev4TXEv9reG7m809Ccanpam5tmX+8WUZT/AIGFPtXDeANAj8SeNNJ0y4yIJpx5oHBKqCzD24BGe1fqPfftTW3ifxBJ4b+HemN4y14BiUsJFaCFcfeluDiKMA8ZBk5wMZIqLwP8adE8fPe+GfFuh/2Z4nCGLUNH1CJIr1eAdynAEqc5DpjAAOMmtMXUxFXC1adL3ZuLSfZtaP5Mqh7OFaEp6xTV15X1PKNJ1G28OW1rHYgQpAgWOOJMKAP4cdMe1VtD/ZI8JftB+KvEWu6il/4YbZFti0do44mlYtlyjo3JC84I9fXPt/hP4MwWutyS2F5pmqaQ0boy3MZW5iDKQpKbfvA9CcZx0Feo+BvBVt4I0j7JC5nmkbfNOwwXbpwOwHYV+B8G8O53lWZKvWvCmnLmV1rppbum3f8A7d11sfoue5rgMZhXTp+9J2s+2uv3Wt8/U+HPGv8AwTP17SM3vgrxjb388R8yO21GFrWVSORtlQsC3oSF+tc5pn7SHxK+AWrR+Gfir4bur0IMR3MpCXLIONyyjMc49wc56tX6U1xvxY+FHh74yeDrzw74is0uLeVSYLjaPNtZcYWWNuzD8iMg5BIr9/Vbm0qK6PzbltsfNvh/9o74f/E6KCz0zVjb6tIw8qwvoWilJ/ug8qT7Bj0rpq/OfRrO8+H3xXtre4/4+tD1lYrgpyoMU4R/wyMfjX6MV9plVo0nBbJ/mfnfEVO2IhU7r8v+HNnw/rMelxXSXF8LS2cDcJJvLjb1yCQD+NYniX48/DvwbA32/wAV6WpQf8e9nMLiQe2yPcR+Iq7ovgPw78Rdc0/SvE+lw6vp4kadba4BKGRY3AJHfALV634b+B3w98ITLNo/gnQbC4U5W4i0+LzR/wADK7v1rwM3hGGKbfVJ/p+h9HkFR1MEo/ytr9f1PmJPG3xN+Pv/ABL/AIY+Grrw1oM3yy+LtfTyVCdzAnO4+hXcef4eo+hPgN+z9oHwH0Ca2095NT1u+YS6lrd2Mz3cnX32qCThcnqSSSSa9RorxXO65UrI+jt3CiiisxhRRRQAV5f+0d8DrP8AaB+GV34YnvDpd8kq3mnagqb/ALNcoGCsV/iUqzow7q5r1Cimm07oNz8cPEfgr4p/sp+LhdahaXfhq5RvKj1e1/e6bdqewlI2FTgHy5cMMjjPNeiaJ+3V47WyjNxoWkaopHy3EcMqb/c7XKn8AK/UeeCK6heGaNJoXBV45FDKwPUEHqK831f9mX4Sa7cm4vvhr4VmnY5aUaTArMfUlVGfxrq9tGXxxuZ8rWzPz41z9vHxyo8pNM0HRy4O1545N34F5AP0qDw9eftF/tHlE0WPXZ9Lmxm8VRpOnhT1zKVTzMdcKHJr9IfDPwK+HHgydZ9C8B+G9JuF5FxaaVAkv/fYXd+tdzSdaK+GIcr6s+NPgz/wTh8O6CF1L4maiPGepuMtpVqXh02JiOSefMnOeQXIHJ+Ws34hf8E5pdL1R9a+EnjK68O3QO5NL1WeVo06cRXSZljAAwAwk619u0Vl7Wd73K5Ufm3fH9qz4VN5F/o2pa5ZxgkTQWcerRsB6NADMf8Agar9Kxx+1z8ZbUmK48E2scoOCt1ot7E+f90yKf0r9PKKv2qe8ULlfc/M2w+L/wC0n8RAY9A8H6haMx2rJb+H5Ioz9JbkGMfiwr0Pwj+xN8TfijdxXvxd8a3VnpoYP/ZNtdC5nPTjAzBCc55XzQfQV930UnWf2UkHL3OV+HPwv8MfCbw+mjeFtJh0uyGC5TLSTMBjfI5yztjjJJwMAYAAqn8T/g34U+L2mx23iLThLcQc2uo27eVd2rdmilHIwTnByMgZBxXbUVjd3uWfI/iXwL8bPgmxutBmj+K3huAl0guMxavbqMnAdeZD0AYb2JJO1RVPwn+3poKXD6d4hGo+F9QhPkSQazaGaOJx1XfH8+fUuBivsSuN+IPwd8FfFS38rxV4bsdXYIY1uJE2XEanqEmQiRAf9lhWilF/EibPocHB+1T4G1S12x+I/Dcyum19+txwMcjn5SMivC/HH7XUHgyWdrLxNZ6hJCWXy7G6F0brDLujLpwodH3q4GUlWUAhWC10PjH/AIJpeBtYuPP8P+ItY8PnGBbTLFd26jtgEJIfxkNcrp//AAS5tl1CKTUPiTO9mrZaHT9FSGRh6b5ZpQPrtraLox3ZL5jnf+Cf1vc+NPjd8RPGk9kIrOexnMoByiSXNwsgj9xiN+38Ne316PoHgnwf+zz8N5PDPhmD7NvRv9bKZbm5lZQpllc8k4A9AAoVQAAK84r6vJ4yanUasna3yPgeI6sZVKdJO7je/wA7f5G54Hn+z+LdKb1nCf8AfXH9a+gq+dPDBI8SaSR1+1xf+hivouvPz1fvYPy/U9Hhp/uKi8/0CiiivmT7EKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuI+K1/qOn6LbtZSSQxPLtmkiOCBjgZHQHn9K7eorm2ivLeSCeNZYZBtZHGQRXRh6qo1Y1JK6XQ5MXRliKE6UZcra3Pmp7iWRizyOzHuzEmlS6mi+5NIn+6xFena78HkldpdJuhCDz5FxkqPow5/MH61yN58OvEFkTnT2mX+9Cyvn8Ac/pX31LH4WstJJeT0Py+vlmNw8veg35rX8v1MqHxDqtv/qtSvI/92dh/WrsXjnX4R8uq3B/3m3fzqpJ4Z1eI/Ppd6v1t3/wph0HUx1067H/AGwb/Ct3HDz3UX9xzKWLp7OS+81P+FieIsY/tN/++E/wqrc+Mtcu1Kyapc4PUJIUz+WKovpF9GMvZXCj/aiYf0qqylSQQQR1BpxoYfeMF9yFPE4q1pzl82xXdpHLOxZjySTkmm0UV1HEWdNvn0zULa7jUM8EiyqrdCQc16jD8ZrFkHm6fcI/cIysPzOK8lorhxGCo4pp1Vqj0cJmGIwSaoysn5HsD/GTSRHlbS8Z/wC6VQD891Yt/wDGa7kyLLT4of8AamcufyGK85ormhlWEg78t/VnbUzzHVFbnt6JHTXXxI8Q3TE/2gYh/dijVQP0zTIPiF4ht2BXUpG9nVWH6iucort+q4dK3s19yPOeOxTfN7WV/VnqvhL4rNfXcVnq0SRtIQiXMXAyem4f1H5UVw/hjwjf+JLyJYYXS23DzLkjCqO+D3PsKK+Zx2FwMKtuflfZK/8Awx9lluNzKpRv7PnXRt2/4f1PoGiiivlz7MKKKKACiiigAooooAKKKKACiiigAooooAKKKKACsbxN4UsvFFmYblNko5jnQDeh/qPaiitIVJUpKcHZoyqUoVoOnUV0zyjVfhhrmnSsIYBfQ9pIWGfxU8/zqC2+G3iG6GRYGIessir+mc0UV9As4xCp3sr+n/BPlnw/hHVteSXqv8iSf4Y+IoFLCzWUD/nnKpP6msO70DU7EkXGn3MOO7xMB+eKKK7sDmVbES5Zpf18zzMyyfD4SHNTb+bX+RRKlTggg+hq9YaFqOqOFtLKecnusZx+J6CiivbxNWVGm5x3PnMJQjXrKnLZno/hb4TRQqtxrR86XqLWNvlX/eI6/QcfWu9t9JsrSMRwWcEKDoqRgD+VFFfn1fF1sTLmqS/yP1XDYHD4SPLSj8+r+ZaAwMDpRRRXGd5//9k="><br>为了更好的视觉效果,请竖屏查看！</div>');
    $('body').append(mask);
    if (window.orientation == 0 || window.orientation == 180) {
        $('#mask_box').css("display", "none");
        return false;
    } else if (window.orientation == 90 || window.orientation == -90) {
        $('#mask_box').css("display", "block");
        return false;
    }

};

// 使用方法 直接在页面调用下面的一行代码
// my_alert("confirm_error", "加载失败","卡券信息加载失败啦，","请再试试吧！",["知道啦"],["green"],function(){alert(1)})
// my_alert("select", "加载成功","卡券信息加载失败啦，","请再试试吧！",["知道啦","下一步"],["green","red"],function(){alert("左")},function(){alert("右")})
// my_alert("select_correct", "加载成功","卡券信息加载失败啦，","请再试试吧！",["知道啦"],["#ccc"],function(){alert(1)});  

function my_alert(type, text, inte, desc, btn_array, btn_color, objright, objleft) {
    var data = {
        type: type,
        text: text,
        inte: inte,
        desc: desc,
        btn: btn_array,
        color: btn_color
    };
    var alertBox = alertFn(data);
    $('#alert_box').remove();
    $('body').append(alertBox);

    alertBox.show(); //在固定的位置直接使用
    alertBox.find('#alert_confirm').on('click', objright);
    alertBox.find('#alert_cancel').on('click', objleft);
    alertBox.find('#alert_confirm').on('click', function() {
        alertBox.hide();
    });
    alertBox.find('#alert_cancel').on('click', function() {
        alertBox.hide();
    });
};

var alertFn = function(o) {
    var o = o || {};
    var centerCon = ''; //中心内容
    var centerBtn = ''; //按钮选择
    var alertAll = '';
    if (o.type && o.type == 'confirm_error') {
        centerCon = '<div style="font-size:20px;color:black;padding:30px 12px 8px 12px;line-height:140%;"><span style="font-size:20px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEyMjVBN0NGRDE4ODExRTY4REVGQkIwQUI1NzU0ODQzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEyMjVBN0QwRDE4ODExRTY4REVGQkIwQUI1NzU0ODQzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTIyNUE3Q0REMTg4MTFFNjhERUZCQjBBQjU3NTQ4NDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTIyNUE3Q0VEMTg4MTFFNjhERUZCQjBBQjU3NTQ4NDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6zmssZAAADnUlEQVR42tybwU8TQRTGH1RtLUTQJSWIXDCIImlIwFgv3rx40qgH4YQJ4cBdxXg0KH8Alx4MB9CDGg8kXrxxsYkSiQmVpKQhESQQNkgCSG1peG/7toGyLW13Zt3Ol3zpZLM77/12N7szr7NVU1NTIFi16B52EH0B3YyuR/t4n130H/Qyegn9A/2NvSUymROC+jmFfoC+h76J1o7Z/ww6gL6Us11HT6M/oN+h/9lNrNrm8efRI+g4egJ9twi4QtK4jwnuc4RjOA7oR7/kJIb5FhStZu47zrH8TgHSbTiPfor2gnx5OdY8x5YKGEa/R7eA82rh2GEZgE38hBuA/68BzqVJFOAV9Hd0N7hH3ZzTZbuAbeiv6EZwnxr5SraVC0iP7C/oGnCvajhHrRzAaZvvNKekca4ljWReoztEZtHQ0ABdXV1Ge3Z2FtbX10V238E5PyrmCt5G94s+zcFgEHw+n2FqS1A/514QkK7opIzofr/fsi1Yk7l3ZS7gCx71V6rqmcES8Cz6CVS+iOGcFaAKcKYe5wKeRA8pBDjETFnAOzwTV0W1PK/MAvaCenpoAtJ865aCgMTkJcCQy8ebdsapIRNQVV0nwKsKA3YSYKvCgK0EGFAYMECAdQoD1hHgaYUBfdWguAjwr8J8uwS4qTDgJgGuKQy4RoBxJyKl02nLtmTFCXDOiUiLi4uWbcmaowJNxIlI0WgUVldXjbau604BRkzAbSdmFA6CATNF6BZNoD8r+IAhpoT5on+rIKDBZBZJP0JmdYO0uozH4zHK9yQq2+/t7cmE22KmLGASPQaSSodUyQ6FQtmK9s7ODkQiEeNXksaY6VBddFTarLOz80jpnrZJ1OjBsaipDVmQ5q15UJqmyYTbsAIkPZcxNk0mk0e2pVIpKWNPZoB8gBRVeI3UauQiaTTTywx5AUmf0OMioy4sLEAsFjOuJJnatE2wxjn3Q6oqsBiPxqgdUBmKQp7qYKEZPS2q0ysATudcoVRAOvAGj+ncqm3OUS8HkBRDX3PppJhy6uEcoVxA0k80LY+YcRHcDOc0f9yOxVbVVvhshV0AF+ZcVorZudSy4SD6PmSWITutJY49WMpB5dRFablxOw+JEg6AJThWO8cG2YDGhAAyi1TpjxtajbssAYz6fIW+yLHKmnrYrWz/Rj9j0D6eg9l5d+rcRx/3OWz35IladU+r49+wcz8roJW6tP6a/uQ5+FnBJif/CyR+VrAvwAAQ5NpIh5URWwAAAABJRU5ErkJggg==) no-repeat left; background-size: 22px 22px;padding-left:30px">' + o.text +
            '</span></div>' + '<div style="font-size:13px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">' + o.inte + '</div>' +
            '<div style="font-size:13px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all">' + o.desc + '</div>';
        centerBtn = '<div style="display:table;width:100%;table-layout:fixed;padding:7px 0;border-top:solid 1px #e4e4e4;">' +
            '    <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:18px;height:30px;border-left:solid 1px #e4e4e4;color:' + o.color[0] + ';" id="alert_confirm">' + o.btn[0] + '</div>' +
            '</div>';
    } else if (o.type && o.type == 'select') {
        centerCon = '<div style="font-size:20px;color:black;padding:30px 12px 8px 12px;line-height:140%;"><span style="font-size:20px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZERTdFM0UwRDE4NjExRTY4NjAyRURERjIwRjY5OEVFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZERTdFM0UxRDE4NjExRTY4NjAyRURERjIwRjY5OEVFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkRFN0UzREVEMTg2MTFFNjg2MDJFRERGMjBGNjk4RUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkRFN0UzREZEMTg2MTFFNjg2MDJFRERGMjBGNjk4RUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6V7dqwAAAGq0lEQVR42tyb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) no-repeat left; background-size: 20px 20px;padding-left:30px">' + o.text +
            '</span></div>' + '<div style="font-size:13px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">' + o.inte + '</div>' +
            '<div style="font-size:13px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all">' + o.desc + '</div>';

        centerBtn = '<div style="display:table;width:100%;table-layout:fixed;padding:7px 0;border-top:solid 1px #e4e4e4;">' +
            '    <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:18px;height:30px;color:' + o.color[0] + ';" id="alert_confirm">' + o.btn[0] + '</div>' +
            '    <div style="display:table-cell;vertical-align:middle; color:red; text-align:center;font-size:18px;height:30px;border-left:solid 1px #e4e4e4;color:' + o.color[1] + ';" id="alert_cancel">' + o.btn[1] + '</div>' +
            '</div>';
    } else if (o.type && o.type == 'select_correct') {
        centerCon = '<div style="font-size:20px;color:black;padding:30px 12px 8px 12px;line-height:140%;"><span style="font-size:20px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZERTdFM0UwRDE4NjExRTY4NjAyRURERjIwRjY5OEVFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZERTdFM0UxRDE4NjExRTY4NjAyRURERjIwRjY5OEVFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkRFN0UzREVEMTg2MTFFNjg2MDJFRERGMjBGNjk4RUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkRFN0UzREZEMTg2MTFFNjg2MDJFRERGMjBGNjk4RUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6V7dqwAAAGq0lEQVR42tyb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) no-repeat left; background-size: 20px 20px;padding-left:30px">' + o.text +
            '</span></div>' + '<div style="font-size:13px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">' + o.inte + '</div>' +
            '<div style="font-size:13px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all">' + o.desc + '</div>';

        centerBtn = '<div style="display:table;width:100%;table-layout:fixed;padding:7px 0;border-top:solid 1px #e4e4e4;">' +
            '    <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:18px;height:30px;border-left:solid 1px #e4e4e4;color:' + o.color[0] + ';" id="alert_confirm">' + o.btn[0] + '</div>' +
            '</div>';
    } else {
        centerCon = '<div style="font-size:16px;color:#f00;padding:50px 0 38px;">请输入必填参数type！</div>';
        centerBtn = '';
    };
    alertAll = $('<div style="display:none;overflow:hidden;" id="alert_box">' +
        '    <div style="position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.54);z-index:10000;" id="alert_bg"></div>' +
        '    <div style="width:80%; position:fixed;top:50%;left:50%;z-index:10001;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);">' +
        '        <div style="overflow:hidden;background:#fff;border-radius:10px;margin-top:-36px;">' +
        '            <div style="width:100%;text-align:center;">' + centerCon + '</div>' + centerBtn +
        '        </div>' +
        '    </div>' +
        '</div>');
    return alertAll;
};

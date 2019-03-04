// 需要jquery支持

const getcouponlist = (openid, activity_id,host) => {
  let return_type = {};
  if (openid && activity_id) {
    const getCouponList = {
      "akk_openid": openid,
      "activity_id": activity_id
    };
    $.ajax({
      type: "POST",
      url: host+"couponRecord/list",
      data: getCouponList,
      dataType: "json",
      async: false,
      success: function (data) {
        if (data.return_code != 200) {
          return_type.return_code = "500";
          return_type.return_msg = data.return_msg;
        } else {
          return_type.return_code = "200";
          return_type.return_msg = "";
          var COUPONLIST = [];
          for (var i = 0; i < data.data.list.length; i++) {
            var this_coupon_info = data.data.list[i];
            var require_coupon = {};
            require_coupon.logo_img_src = host + this_coupon_info.local_logo_path;
            require_coupon.title = this_coupon_info.brand_name;
            require_coupon.sub_title = this_coupon_info.title;
            require_coupon.begin_date = timechange(this_coupon_info.begin_timestamp);
            require_coupon.end_date = timechange(this_coupon_info.end_timestamp);
            if (this_coupon_info.end_timestamp < timestamp()) {
              require_coupon.status = "OVERDUE";
            } else {
              require_coupon.status = this_coupon_info.record_status;
            }
            require_coupon.go_url = data.data.show_url+"&openid=" + openid;
            COUPONLIST.push(require_coupon)
          }
          return_type.return_couponlist = COUPONLIST;
        }
      },
      error: function (data) {
        return_type.return_code = "500";
        return_type.return_msg = "网络异常";
      }
    });
  } else {
    return_type.return_code = "500";
    return_type.return_msg = "缺少必要参数";
  }

  //时间戳转化成日期
  function timechange(nS) {
    const d = new Date(parseInt(nS) * 1000);
    let str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":00:00";
    if (d.getMonth() < 9) {
      if (d.getDate() < 10) {
        if (d.getHours() < 10) {
          if (d.getMinutes() < 10) {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-0" + d.getDate() + " " + "0" + d.getHours() + ":0" + d.getMinutes() + ":00";
          } else {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-0" + d.getDate() + " " + "0" + d.getHours() + ":" + d.getMinutes() + ":00";
          }
        } else {
          if (d.getMinutes() < 10) {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-0" + d.getDate() + " " + d.getHours() + ":0" + d.getMinutes() + ":00";
          } else {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-0" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":00";
          }
        }

      } else {
        if (d.getHours() < 10) {
          if (d.getMinutes() < 10) {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-" + d.getDate() + " " + "0" + d.getHours() + ":0" + d.getMinutes() + ":00";
          } else {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-" + d.getDate() + " " + "0" + d.getHours() + ":" + d.getMinutes() + ":00";
          }
        } else {
          if (d.getMinutes() < 10) {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":0" + d.getMinutes() + ":00";
          } else {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":00";
          }
        }

      }
    } else {
      if (d.getHours() < 10) {
        if (d.getMinutes() < 10) {
          str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + "0" + d.getHours() + ":0" + d.getMinutes() + ":00";
        } else {
          str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + "0" + d.getHours() + ":" + d.getMinutes() + ":00";
        }
      } else {
        if (d.getMinutes() < 10) {
          str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":0" + d.getMinutes() + ":00";
        } else {
          str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":00";
        }
      }
    }
    return str
  }

  //获取当前时间的时间戳
  function timestamp() {
    return parseInt(new Date().getTime() / 1000);
  }

  return return_type;

  // 成功的返回
  /* return return_type = {
   "return_code": "200",
   "return_msg": "",
   "return_couponlist": [{
   "logo_img_src": "./static/data/images/second-prize.png", //logo图片的地址
   "title": "可口可乐", //标题
   "sub_title": "买一赠一", //副标题
   "begin_date": "2017-06-01 00:00", //有效期：开始日期
   "end_date": "2017-09-30 23:59", //有效期：结束日期
   "status": "1", //卡券状态 1、"OVERDUE"(已过期) 2、"APPLIED" (已领取)3、"CONSUMED"(已使用)
   "go_url": "http://baidu.com" //跳转地址
   }, {
   "logo_img_src": "./static/data/images/first-prize.png", //logo图片的地址
   "title": "可口可乐", //标题
   "sub_title": "买一赠一", //副标题
   "begin_date": "2017-06-01 00:00", //有效期：开始日期
   "end_date": "2017-09-30 23:59", //有效期：结束日期
   "status": "3", //卡券状态 1、"OVERDUE"(已过期) 2、"APPLIED" (已领取)3、"CONSUMED"(已使用)
   "go_url": "http://baidu.com" //跳转地址
   }, {
   "logo_img_src": "./static/data/images/first-prize.png", //logo图片的地址
   "title": "可乐.可乐.可乐.可乐.可乐.可口可乐", //标题
   "sub_title": "买二赠一,买一赠一,买一赠一,买一赠一", //副标题
   "begin_date": "2017-06-01 00:00", //有效期：开始日期
   "end_date": "2017-09-30 23:59", //有效期：结束日期
   "status": "2", //卡券状态 1、"OVERDUE"(已过期) 2、"APPLIED" (已领取)3、"CONSUMED"(已使用)
   "go_url": "http://baidu.com" //跳转地址
   }]
   };*/
  // 失败的返回
  // return_type = {
  //     return_code: "500",
  //     return_msg: "" //异常信息
  // }

};
export {getcouponlist}

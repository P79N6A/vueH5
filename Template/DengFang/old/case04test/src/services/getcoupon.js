// 需要jquery支持

const getcoupon = (openid, activity_id, xjj_openId, third_party_name) => {
  let return_type = {};
  if (openid && activity_id && xjj_openId && third_party_name && false) {
    const getCoupon = {
      "openid": openid,
      "activity_id": activity_id,
      "third_party_openid": xjj_openId,
      "third_party_name": third_party_name
    };
    $.ajax({
      type: "POST",
      url: "http://ab.aikaka.com.cn/Acmp/AcmpApi/shakeFor/drawCoupon",
      data: getCoupon,
      dataType: "json",
      async: false,
      success: function (data) {
        if (data.return_code !== 200) {
          return_type.return_code = "500";
          return_type.return_msg = data.return_msg;
        } else {
          return_type.return_code = "200";
          return_type.return_msg = "";
          return_type.item_id = data.data.item_id;
          return_type.logo = "http://ab.aikaka.com.cn/Acmp/AcmpApi/" + data.data.coupon.local_logo_path;
          return_type.title = data.data.coupon.title;
          return_type.coupon_url = "http://ab.aikaka.com.cn/Coupon/show_webcoupon?coupon_code=" + data.data.coupon_code + "&openid=" + openid;
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

  // return return_type;

  // 成功的返回
  return return_type = {
   return_code: "200",
   return_msg: "",
   item_id: "-1", //卡券的item_id
   logo: "./static/data/images/intact.png",//弹出中奖的logo地址
   title: "可口可乐", //弹出中奖的标题
   coupon_url: "http://baidu.com" //点击立即查看跳转地址
   }

  // 失败的返回
  // return_type = {
  //     return_code: "500",
  //     return_msg: "" //异常信息
  // }

};
export {getcoupon}

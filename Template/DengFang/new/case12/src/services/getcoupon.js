// 需要jquery支持
// 游戏结束都需要调用此接口
const getcoupon = (openid, activity_id, xjj_openId, third_party_name, host) => {
  let return_type = {};
  if (openid && activity_id && xjj_openId && third_party_name) {
    const getCoupon = {
      "openid": openid,
      "activity_id": activity_id,
      "third_party_openid": xjj_openId,
      "third_party_name": third_party_name
    };
    $.ajax({
      type: "POST",
      url: host + "shakeFor/drawCoupon",
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
          return_type.item_id = data.data.activity_item_id;
          return_type.logo = host + data.data.coupon.local_logo_path;
          return_type.title = data.data.coupon.title;
          return_type.coupon_url = data.data.show_url + "&openid=" + openid;
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
    item_id: "2", //卡券的item_id
    logo: "./static/data/images/prize01.png",//弹出中奖的logo地址
    title: "可口可乐可口可乐可口可乐可口可乐", //弹出中奖的标题
    coupon_url: "http://baidu.com" //点击立即查看跳转地址
  }


  // 失败的返回
  // return_type = {
  //     return_code: "500",
  //     return_msg: "" //异常信息
  // }

};
export {getcoupon}

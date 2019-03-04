// 需要jquery支持
const getHeadImg = (openid, host,callback) => {
  let return_type = {};
  if (openid && false) {
    const getHeadData = {
      "openid": openid
    };
    $.ajax({
      type: "POST",
      url: host + "",
      data: getHeadData,
      dataType: "json",
      success: function (data) {
        if (data.return_code !== 200) {
          return_type.return_code = "500";
          return_type.return_msg = data.return_msg;
          callback(return_type);
        } else {
          return_type.return_code = "200";
          return_type.return_msg = "";
          return_type.headImg = data.data.img_url;
          callback(return_type);
        }
      },
      error: function (data) {
        return_type.return_code = "500";
        return_type.return_msg = "网络异常";
        callback(return_type);
      }
    });
  } else {
    return_type.return_code = "500";
    return_type.return_msg = "缺少必要参数";
    callback(return_type);
  }

  // return return_type;

  // 成功的返回
/*  return return_type = {
    return_code: "200",
    return_msg: "",
    headImg: "./static/data/images/user.jpg"//头像地址绝对地址可直接使用
  }*/

  // 失败的返回
  // return_type = {
  //     return_code: "500",
  //     return_msg: "" //异常信息
  // }

};
export {getHeadImg}

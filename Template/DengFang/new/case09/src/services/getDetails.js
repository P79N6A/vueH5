const getDetails = (openid, friendOpenid, host, callback) => {
  let return_type = {};
  if (openid) {
    const getHeadData = {
      "openid_cut_for": friendOpenid,
      "openid": openid,
    };
    $.ajax({
      type: "POST",
      url: host + "cutPrice/cut",
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
          // 砍价对象的状态
          if (data.data.status == "CUTTING") {
            // 砍价中
            return_type.status = "DOING";
          } else if (data.data.status == "CUTED") {
            // 砍价完成未领取卡券
            return_type.status = "DONE";
          } else if (data.data.status == "FINISHED") {
            // 砍价完成并已经领取卡券
            return_type.status = "FINISHED";
          }
          var helperList = [];
          for (var i = 0; i < data.data.cutter.length; i++) {
            var cutter_info = {};
            var this_cirel = data.data.cutter[i];
            cutter_info.prices = this_cirel.price;
            cutter_info.headImage = this_cirel.headimgurl;
            cutter_info.name = this_cirel.nickname;
            cutter_info.dateTime = this_cirel.create_time;
            helperList.push(cutter_info)
          }
          return_type.helperList = helperList;
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
};
export {getDetails}
//返回实例
/*
 callback({
 return_code: "200",
 return_msg: "",
 status:'DOING',
 helperList: [   //好友帮助列表
 {
 headImage: './static/data/images/user.jpg',   //头像地址
 name: 'Felix',   // 昵称
 },
 {
 headImage: './static/data/images/user.jpg',   //头像地址
 name: 'Felix',   // 昵称
 },
 {
 headImage: './static/data/images/user.jpg',   //头像地址
 name: 'Felix',   // 昵称
 },
 {
 headImage: './static/data/images/user.jpg',   //头像地址
 name: 'Felix',   // 昵称
 }
 ],
 });
 */

/*
 * 1 用户进入主页面不掉用任何数据，只展示砍价对象；
 * 2 确认砍价后根据itemid调用接口，无论是分享后的帮忙者还是原来的用户，都可以通过这个接口判断砍价对象的信息；
 * 3 当然每次都会先判断砍价对象的状态
 * 4 后台会根据 所传的【friendOpenid】 和【openid】 进行判断，
 如果一致表示是参与的用户这时【helperList】会返回所有的砍价好友的列表；
 如果不一致表示参与的是帮助者这时【helperList】会返回当前帮助者的唯一砍价列表；
 */
const getDetails = (itemId, openid, friendOpenid, host, callback) => {
  let return_type = {
    return_code: 200,
    originalPrices: 100,
    targetPrices: 100,
    cutPrices: 10,
    limitPrices: 90,
    store_code: 111,
    helperList: [
      {
        name: 'asd',
        headImage:'./static/data/images/prize01.png'

      }
    ]
  };
  callback(return_type);
  if (openid && itemId && false) {
    const getHeadData = {
      "openid_cut_for": friendOpenid,
      "openid": openid,
      "activity_item_id": itemId
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
          return_type.originalPrices = data.data.info.price_from; //原价
          return_type.targetPrices = data.data.info.price_to; //目标金额
          return_type.cutPrices = data.data.info.cuted; //被砍掉金额
          return_type.limitPrices = data.data.info.limit; //未砍金额
          return_type.store_code = data.data.info.store_code; //砍价对象所在的门店
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

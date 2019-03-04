//合成金卡
const compoundCard = (openid, xx_id, xxx_id, callback) => {
  callback({
    return_code: "200",
    return_msg: "",
    item_id: 0,
    card_id: 15
  });

  // 失败的返回
  // callback({
  //     return_code: "500",
  //     return_msg: "" //异常信息
  // })

};
export {compoundCard}

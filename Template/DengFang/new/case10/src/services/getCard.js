//抽福卡
//cardId?获得对应的福卡:随机获得一张福卡
const getCard = (openid, cardId, xx_id, xxx_id, callback) => {
  console.log(cardId)
  callback({
    return_code: "200",
    return_msg: "",
    item_id: Math.ceil(Math.random() * 5),
    // item_id: 1,
    card_id: Math.ceil(Math.random() * 500)
  });

  // 失败的返回
  // callback({
  //     return_code: "500",
  //     return_msg: "" //异常信息
  // })

};
export {getCard}

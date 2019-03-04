//获取福卡列表
const getCardList = (openid, xx_id, xxx_id, callback) => {
  callback({
    return_code: "200",
    return_msg: "",
    cardList: [
     /* {
        item_id: 2,   //卡片id
        list: [{
          card_id: 23
        }, {
          card_id: 24
        }, {
          card_id: 25
        }
        ]
      },
      {
        item_id: 3,   //卡片id
        list: [{
          card_id: 20
        }, {
          card_id: 231
        }
        ]
      }, {
        item_id: 4,   //卡片id
        list: [{
          card_id: 201
        }, {
          card_id: 2312
        }
        ]
      }*/
    ],
  });

  // 失败的返回
  // callback({
  //     return_code: "500",
  //     return_msg: "" //异常信息
  // })

};
export {getCardList}

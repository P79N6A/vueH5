//获取微信签名
const getWXConfig = (callback) => {
  // 成功的返回
  callback({
    return_code: "200",
    return_msg: "",
    appId: "wxfcba6640a1c27eb1", // 必填，公众号的唯一标识
    timestamp: 1504343176, // 必填，生成签名的时间戳
    nonceStr: 'n5x6zlykrud45oj', // 必填，生成签名的随机串
    signature: 'b988827e97f7508e4688cad0b94877d0ce3851c1',// 必填，签名，见附录1
  });
  // 失败的返回
  // callback({
  //     return_code: "500",
  //     return_msg: "" //异常信息
  // });
};
export {getWXConfig}

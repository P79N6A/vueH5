//获取微信签名
const getWXConfig = (callback) => {
  // 成功的返回
  callback({
    return_code: "200",
    return_msg: "",
    appId: "wxfcba6640a1c27eb1", // 必填，公众号的唯一标识
    timestamp: 1500967778, // 必填，生成签名的时间戳
    nonceStr: '68s550nh7ulk53k', // 必填，生成签名的随机串
    signature: 'dd9c5d307c40c9a7034d5ff6cc743e576610ef4a',// 必填，签名，见附录1
  });
  // 失败的返回
  // callback({
  //     return_code: "500",
  //     return_msg: "" //异常信息
  // });
};
export {getWXConfig}

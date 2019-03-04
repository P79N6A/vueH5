import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex)

const state = {
    images: [
        "https://download.aikaka.com.cn/45b62a88c55839d4f044910051ddecc4?f=png",
        "https://download.aikaka.com.cn/46e646abad9fd189c0a12c57b02393ec?f=png",
        "https://download.aikaka.com.cn/0397fd98d855b6f3fd51e67a61426193?f=png",
        "https://download.aikaka.com.cn/974553dd6cc09c7a14899cc772cf72db?f=png",
        "https://download.aikaka.com.cn/8c7ca053b8e60c3f25b40c0e544c5915?f=png",
        "https://download.aikaka.com.cn/2e431f291bd4df5ad50caf700ce7ee5f?f=png",
        "https://download.aikaka.com.cn/2d593e1bc1c6cca76a71a4cc2b099bbd?f=png",
        "https://download.aikaka.com.cn/5671124523ee230c21994021f9b23ac9?f=png",
        "https://download.aikaka.com.cn/a3b2f16a0391c953f482b3ced24e9c28?f=png",
        "https://download.aikaka.com.cn/923fd2191bdda1917d2931a8d3f33569?f=png",
        "https://download.aikaka.com.cn/d63dbb38755746f7aabc3b5a7b43576f?f=png",
        "https://download.aikaka.com.cn/d49b0a93d6735e1712d95cef5509777e?f=png",
        "https://download.aikaka.com.cn/7c1625fdfb5a0396e07a52843feaac2b?f=png",
        "https://download.aikaka.com.cn/55eb62bac553fcbef8340488b010dd01?f=png",
        "https://download.aikaka.com.cn/8e44173d7667c132abb444fbc8f70ce7?f=png",
        "https://download.aikaka.com.cn/d2639f6e93403c552f1fee557f27d850?f=png",
        "https://download.aikaka.com.cn/ef78d8e135b0e2632cf1f96f8a4b42c2?f=png",
        "https://download.aikaka.com.cn/633c426f68d2009a40de6ad7bbff9fbb?f=png",
        "https://download.aikaka.com.cn/810957dfd64ae67674a70822f85bfc86?f=png",
        "https://download.aikaka.com.cn/fbff09cabe7b35f71fa2a870c5c41eac?f=png",
        "static/images/1.jpg",
        "static/images/2.jpg",
        "static/images/3.jpg",
        "static/images/4.jpg",
        "static/images/5.jpg",
        "static/images/6.jpg",
        "static/images/7.jpg",
        "static/images/8.jpg",
        "static/images/9.jpg"
    ],
    pages: [
        {
            "bg_image": "https://download.aikaka.com.cn/46e646abad9fd189c0a12c57b02393ec?f=png",
            "button": "https://download.aikaka.com.cn/45b62a88c55839d4f044910051ddecc4?f=png",
            "supernatant": "https://download.aikaka.com.cn/8c7ca053b8e60c3f25b40c0e544c5915?f=png",
            "logo": "https://download.aikaka.com.cn/974553dd6cc09c7a14899cc772cf72db?f=png",
            "images": [
                "https://download.aikaka.com.cn/0397fd98d855b6f3fd51e67a61426193?f=png",
                "https://download.aikaka.com.cn/2d593e1bc1c6cca76a71a4cc2b099bbd?f=png",
                "https://download.aikaka.com.cn/2e431f291bd4df5ad50caf700ce7ee5f?f=png"
            ]
        }, {
            "bg_image": "https://download.aikaka.com.cn/46e646abad9fd189c0a12c57b02393ec?f=png",
            "logo": "https://download.aikaka.com.cn/923fd2191bdda1917d2931a8d3f33569?f=png",
            "images": [
                "https://download.aikaka.com.cn/d63dbb38755746f7aabc3b5a7b43576f?f=png",
                "https://download.aikaka.com.cn/d49b0a93d6735e1712d95cef5509777e?f=png"
            ],
            "prize": [
                "https://download.aikaka.com.cn/7c1625fdfb5a0396e07a52843feaac2b?f=png",
                "https://download.aikaka.com.cn/55eb62bac553fcbef8340488b010dd01?f=png",
                "https://download.aikaka.com.cn/8e44173d7667c132abb444fbc8f70ce7?f=png"
            ]
        }, {
            "bg_image": "https://download.aikaka.com.cn/46e646abad9fd189c0a12c57b02393ec?f=png",
            "button": "https://download.aikaka.com.cn/d2639f6e93403c552f1fee557f27d850?f=png",
            "supernatant": "https://download.aikaka.com.cn/fbff09cabe7b35f71fa2a870c5c41eac?f=png",
            "logo": "https://download.aikaka.com.cn/ef78d8e135b0e2632cf1f96f8a4b42c2?f=png",
            "images": [
                "https://download.aikaka.com.cn/810957dfd64ae67674a70822f85bfc86?f=png"
            ],
            "prize": [
                "https://download.aikaka.com.cn/633c426f68d2009a40de6ad7bbff9fbb?f=png"
            ]
        }
    ],
    music: {
        "src": "static/test.mp3",
        "image": "static/images/music.png",
        "bg_img": "static/images/music_bg.gif"
    },
    trunplatConfig: {
        "bg_image": "https://download.aikaka.com.cn/5671124523ee230c21994021f9b23ac9?f=png",
        "button": "https://download.aikaka.com.cn/a3b2f16a0391c953f482b3ced24e9c28?f=png"
    },
    // ---------------------共用属性-----------------------
    xjjOpenId: '',
    openId: '',
    activityId: '1229',
    from: '',
    storeCode: 'AIKAKATEST002',
    acmp_host: 'http://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/',
    coupon_bag_host: 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/',
    // ---------------------动态可变属性---------------------
    prizeDrawNumber: 5, //默认抽奖次数
    coupon_code: "" //默认卡券ID
}
export default new Vuex.Store({
    state,
    actions,
    mutations
})
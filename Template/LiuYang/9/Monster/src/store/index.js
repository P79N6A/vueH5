import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex)

const state = {
    images: [
        "static/page1/bj.jpg",
        "static/page1/logo.png",
        "static/page1/anniu.png",
        "static/page1/ren.png",
        "static/page2/bj.jpg",
        "static/page2/guan.png",
        "static/page2/0.png",
        "static/page2/1.png",
        "static/page2/2.png",
        "static/page2/2h.png",
        "static/page2/last.png",
        "static/page2/x.png",
        "https://download.aikaka.com.cn/e324bd656c9b64b55cf99a5d4009e783?f=png",
        "static/page3/1.png",
        "static/page3/2.png",
        "static/page3/3.png",
        "static/page3/4.png",
        "static/page3/button.png",
        "static/page3/diwen.png",
        "static/page3/hx.png",
        "static/page3/lq.png",
        "static/page3/return.png",
        "http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/uploads_temp/img/2018-09-28/5bad9b9093b461538104208.png",
        "static/images/download.png",
        "static/images/ok.png",
        "static/images/x.png",
        "static/images/verification.png"
    ],
    pages: [
        {
            "bg_image": "static/page1/bj.jpg",
            "button": "static/page1/anniu.png",
            "supernatant": "static/page1/ren.png",
            "logo": "static/page1/logo.png",
            "images": [
                "https://download.aikaka.com.cn/0397fd98d855b6f3fd51e67a61426193?f=png",
                "https://download.aikaka.com.cn/2d593e1bc1c6cca76a71a4cc2b099bbd?f=png",
                "https://download.aikaka.com.cn/2e431f291bd4df5ad50caf700ce7ee5f?f=png"
            ],
            "rules": [{
                "content": "static/page2/wenzi.png",
                "button": "static/page2/x.png"
            }, {
                "content": "static/page2/duihuan.png",
                "button": "static/page2/x.png"
            }]
        }, {
            "bg_image": "static/page2/bj.jpg",
            "logo": "static/page1/logo.png",
            "images": [
                "static/page1/logo.png",
                "static/page2/guan.png"
            ],
            "prize": [
                "https://download.aikaka.com.cn/7c1625fdfb5a0396e07a52843feaac2b?f=png",
                "https://download.aikaka.com.cn/55eb62bac553fcbef8340488b010dd01?f=png",
                "https://download.aikaka.com.cn/8e44173d7667c132abb444fbc8f70ce7?f=png"
            ],
            "prize_img_box":[
                {
                    "item_id": 0,
                    "rules": false,
                    "prize_img": "static/page2/0.png",
                    "zi": "static/page2/0.png"
                },
                {
                    "item_id": 1,
                    "rules": false,
                    "prize_img": "static/page2/1.png",
                    "zi": "static/page2/1.png"
                },
                {
                    "item_id": 2,
                    "rules": false,
                    "prize_img": "static/page2/2.png",
                    "zi": "static/page2/2.png"
                },
                {
                    "item_id": 3,
                    "rules": false,
                    "prize_img": "static/page2/2h.png",
                    "zi": "static/page2/2h.png"
                }
            ]
        }, {
            "bg_image": "static/page2/bj.jpg",
            "logo": "static/page1/logo.png",
            "images": [
                "static/page1/logo.png",
                "static/page2/guan.png"
            ],
            "prize": [
                "https://download.aikaka.com.cn/7c1625fdfb5a0396e07a52843feaac2b?f=png",
                "https://download.aikaka.com.cn/55eb62bac553fcbef8340488b010dd01?f=png",
                "https://download.aikaka.com.cn/8e44173d7667c132abb444fbc8f70ce7?f=png"
            ]
        }
    ],
    coupon:[
        "http://acmp.aikaka.com.cn/cocacola/Acmp/AcmpApi/uploads_temp/img/2018-09-28/5bad9b9093b461538104208.png"
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
    activityId: '1234',
    from: '',
    storeCode: 'AKK201809280951387934',
    acmp_host: 'https://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/',
    coupon_bag_host: 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/',
    sessionKey: "monster",
    // ---------------------动态可变属性---------------------
    prizeDrawNumber: 5, //默认抽奖次数
    coupon_code: "" //默认卡券ID
}
export default new Vuex.Store({
    state,
    actions,
    mutations
})
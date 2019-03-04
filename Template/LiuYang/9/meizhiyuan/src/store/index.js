import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex)

const state = {
    images: [
        "static/page1/anniu.png",
        "static/page1/bj.jpg",
        "static/page1/llogo.png",
        "static/page1/logo.png",
        "static/page1/logo1.png",
        "static/page1/orange.png",
        "static/page1/ren.png",
        "static/page1/rlogo.png",
        "static/page1/yl.png",
        "https://download.aikaka.com.cn/4daaea8ab3796f70b25d526f70d8e645?f=png",
        "https://download.aikaka.com.cn/2e431f291bd4df5ad50caf700ce7ee5f?f=png",
        "static/page2/dx.png",
        "static/page2/dx2.png",
        "static/page2/yo.png",
        "static/page2/xia.png",
        "static/page3/anniu.png",
        "static/page3/bj.jpg",
        "static/page3/tc.png",
        "static/page3/zi.png",
    ],
    pages: [
        {
            "bg_image": "static/page1/bj.jpg",
            "button": "static/page1/anniu.png",
            "supernatant": "static/page1/ren.png",
            "logo": "static/page1/logo.png",
            "prize_img_box": [
                {
                    "item_id": 0,
                    "rules": false,
                    "prize_img": "static/page2/dx.png",
                    "zi": "static/page2/dx.png"
                },
                {
                    "item_id": 1,
                    "rules": false,
                    "prize_img": "static/page2/dx2.png",
                    "zi": "static/page2/dx2.png"
                },
                {
                    "item_id": 1,
                    "rules": false,
                    "prize_img": "static/page2/yo.png",
                    "zi": "static/page2/yo.png"
                }
            ]
        }, {
            "bg_image": "static/page1/bj.jpg",
            "logo": "static/page1/logo.png",
            "prize": [
                "static/page2/dx.png",
                "static/page2/dx2.png",
                "static/page2/yo.png"
            ],
            "prize_img_box": [
                {
                    "item_id": 0,
                    "rules": false,
                    "prize_img": "static/page2/dx.png",
                    "zi": "static/page2/dx.png"
                },
                {
                    "item_id": 1,
                    "rules": false,
                    "prize_img": "static/page2/dx2.png",
                    "zi": "static/page2/dx2.png"
                },
                {
                    "item_id": 1,
                    "rules": false,
                    "prize_img": "static/page2/yo.png",
                    "zi": "static/page2/yo.png"
                }
            ],
            trunplatConfig: {
                "bg_image": "https://download.aikaka.com.cn/4daaea8ab3796f70b25d526f70d8e645?f=png",
                "button": "https://download.aikaka.com.cn/a3b2f16a0391c953f482b3ced24e9c28?f=png"
            },
        }, {
            "bg_image": "static/page3/bj.jpg",
            "button": "static/page3/anniu.png",
            "supernatant": "static/page3/zi.png",
            "logo": "static/page1/logo.png",
            "prize": [
                "static/page3/tc.png"
            ],
            "prize_img_box": [
                {
                    "item_id": 0,
                    "rules": false,
                    "prize_img": "static/page3/tc.png",
                    "zi": "static/page3/tc.png",
                    "table": true
                }
            ],
        }
    ],
    music: {
        "src": "static/test.mp3",
        "image": "static/images/music.png",
        "bg_img": "static/images/music_bg.gif"
    },
    trunplatConfig: {
        "bg_image": "https://download.aikaka.com.cn/4daaea8ab3796f70b25d526f70d8e645?f=png",
        "button": "https://download.aikaka.com.cn/a3b2f16a0391c953f482b3ced24e9c28?f=png"
    },
    // ---------------------共用属性-----------------------
    xjjOpenId: '',
    openId: '',
    activityId: '1233',
    from: '',
    storeCode: 'AIKAKATEST002',
    acmpHost: 'https://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/',
    couponBagHost: 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/',
    sessionKey: "meizhiyuan_",
    // ---------------------动态可变属性---------------------
    prizeDrawNumber: 5, //默认抽奖次数
    coupon_code: "" //默认卡券ID
}
export default new Vuex.Store({
    state,
    actions,
    mutations
})
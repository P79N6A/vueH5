import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex)

const state = {
    images: [
        "static/page1/bg.jpg",
        "static/page1/biaoti.png",
        "static/page1/kele.png",
        "static/page1/lajiao.png",
        "static/page1/lqcg.png",
        "static/page1/xxcy.png",
        "static/page1/zengyin.png",
        "static/page1/zhizhen.png",
        "static/page1/zhuanpan.png",
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
            "bg_image": "static/page1/bg.jpg",
            "button": "static/page1/anniu.png",
            "supernatant": "static/page1/ren.png",
            "logo": "static/page1/logo.png",
            "prize_img_box": [
                {
                    "item_id": 0,
                    "rules": false,
                    "prize_img": "static/page1/1.08.png",
                    "zi": "static/page1/1.08.png"
                },
                {
                    "item_id": 1,
                    "rules": false,
                    "prize_img": "static/page1/zengyin.png",
                    "zi": "static/page1/zengyin.png"
                },
                {
                    "item_id": 1,
                    "rules": false,
                    "prize_img": "static/page1/xxcy.png",
                    "zi": "static/page1/xxcy.png"
                },
                {
                    "item_id": 1,
                    "rules": false,
                    "prize_img": "static/page1/lqcg.png",
                    "zi": "static/page1/lqcg.png",
                    "table": 1
                }
            ],
            trunplatConfig: {
                "bg_image": "static/page1/zhuanpan.png",
                "button": "static/page1/zhizhen.png"
            },
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
                "bg_image": "static/page1/zhuanpan.png",
                "button": "static/page1/zhizhen.png"
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
        "bg_image": "static/page1/zhuanpan.png",
        "button": "static/page1/zhizhen.png"
    },
    // ---------------------共用属性-----------------------
    xjjOpenId: '',
    openId: '',
    activityId: '1242',
    from: '',
    storeCode: 'AIKAKATEST002',
    acmpHost: 'https://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/',
    couponBagHost: 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/',
    sessionKey: "canyinzhuanpan_",
    // ---------------------动态可变属性---------------------
    prizeDrawNumber: 5, //默认抽奖次数
    coupon_code: "" //默认卡券ID
}
export default new Vuex.Store({
    state,
    actions,
    mutations
})
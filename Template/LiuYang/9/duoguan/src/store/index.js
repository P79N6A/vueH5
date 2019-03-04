import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex)

const state = {
    images: [
        "static/images/x.png",
        "static/page1/8.png",
        "static/page1/4999.png",
        "static/page1/anniu.png",
        "static/page1/bai.png",
        "static/page1/bj.jpg",
        "static/page1/bt.png",
        "static/page1/guize.png",
        "static/page1/hui.png",
        "static/page2/1deng.png",
        "static/page2/duihuan.png",
        "static/page2/puhui.png",
        "static/page2/wenzi.png",
        "static/page2/x.png",
        "static/page2/zi.png",
        "static/page2/bj.jpg",
        "static/page3/bj.jpg",
        "static/page3/yanhua1.png",
        "static/page3/yanhua2.png",
        "static/page3/yanhua3.png",
        "static/page3/yanhua4.png",
        "static/page3/yanhua5.png",
        "static/page3/yanhua6.png",
        "static/page3/yanhua7.png",
        "static/page3/yanhua8.png",
        "static/page3/zi.png"
    ],
    pages: [
        {
            "bg_image": "static/page1/bj.jpg",
            "button": "https://download.aikaka.com.cn/45b62a88c55839d4f044910051ddecc4?f=png",
            "supernatant": "https://download.aikaka.com.cn/8c7ca053b8e60c3f25b40c0e544c5915?f=png",
            "logo": "https://download.aikaka.com.cn/974553dd6cc09c7a14899cc772cf72db?f=png",
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
            "logo": "static/page2/zi.png",
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
            "bg_image": "static/page3/bj.jpg",
            "logo": "static/page2/zi.png",
            "images": [
                "https://download.aikaka.com.cn/d63dbb38755746f7aabc3b5a7b43576f?f=png",
                "https://download.aikaka.com.cn/d49b0a93d6735e1712d95cef5509777e?f=png"
            ],
            "prize": [
                "https://download.aikaka.com.cn/7c1625fdfb5a0396e07a52843feaac2b?f=png",
                "https://download.aikaka.com.cn/55eb62bac553fcbef8340488b010dd01?f=png",
                "https://download.aikaka.com.cn/8e44173d7667c132abb444fbc8f70ce7?f=png"
            ]
        }
    ],
    music: {
        "src": "static/test.mp3",
        "image": "static/images/music.png",
        "bg_img": "static/images/music_bg.gif"
    },
    new_image: {
        "bg_image": "https://download.aikaka.com.cn/ad2eba1e6755b30616106365e3bda183",
        "prize_img_box": [
            {
                "item_id": 0,
                "rules": false,
                "prize_img": "static/page2/1deng.png",
                "zi": "static/page1/4999.png"
            },
            {
                "item_id": 1,
                "rules": true,
                "prize_img": "static/page2/puhui.png",
                "zi": "static/page1/8.png"
            }
        ]
    },
    // ---------------------共用属性-----------------------
    xjj_openiid: '',
    openid: '',
    activity_id: '1232',
    from: '',
    store_code: 'AIKAKATEST002',
    acmp_host: 'https://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/',
    coupon_bag_host: 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/',
    wxsdk_url: 'https://ab.aikaka.com.cn/PublicService/Weixin/getJsSdkConfig.php',
    // ---------------------动态可变属性---------------------
    prize_draw_number: 1, //默认抽奖次数
    coupon_code: "", //默认卡券ID
    has_show_rules: false  //显示规则弹窗
}
export default new Vuex.Store({
    state,
    actions,
    mutations
})
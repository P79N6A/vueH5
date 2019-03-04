<template>
    <div class="mains" v-if="!prizes">
        <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
        <img src="static/images/page3/0.jpg" class="bgs" alt="">
        <img src="static/images/page3/1.jpg" class="bgs" alt="">
        <img src="static/images/page3/2.jpg" class="bgs" alt="">
        <img src="static/images/page3/3.jpg" class="bgs" alt="">
        <img src="static/images/page3/4.jpg" class="bgs" alt="">
        <img src="static/images/page3/5.jpg" class="bgs" alt="">
        <img src="static/images/page3/6.jpg" class="bgs" alt="">
        <img src="static/images/page3/7.jpg" class="bgs" alt="">
        <img src="static/images/page3/8.jpg" class="bgs" alt="">
        <img src="static/images/page3/9.jpg" class="bgs" alt="">
    </div>
    <div class="mains" v-else>
        <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
        <img :src="imgsrc" class="bgs" alt="">
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // ---------------------共用属性-----------------------
                xjjOpenId: '',
                openId: '',
                activityId: '1230',
                from: '',
                storeCode: 'AIKAKATEST002',
                acmp_host: 'http://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/',
                coupon_bag_host: 'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/',
                //---------------模板链接数据 end-------------
                config: {},
                loading: false,
                inLoading: true, //加载状态
                images: {}, //图片集--用作图片展示
                imageArr: [],//图片集--用作判断图片加载状态
                iCur: 0, //图片加载的序号
                music: {},
                rulesId: 0,
                hasShowRules: false, //是否展示弹窗规则
                canGetPrize: true,  //时候可以抽奖
                hasShowPrizeResult: false, //是否展示抽奖结果
                inDraw: false, //是否处于抽奖状态
                rotationAngle: 0,
                hasGetPrize: false, // 当前轮数是否已抽奖
                prizeDrawNumberText: '', //抽奖次数提示语
                prizeDrawNumber: 5, //默认抽奖次数
                prize: -1, //默认奖品
                coupon_code: "", //默认卡券ID
                prizeInfo: {},
                allPrize: {},  //全部的奖品信息                // ---------------------私有属性-----------------------
                showArr: [210, 270, 330, 390, 450, 510], //奖盘排列序号,
                imagesArr: [],//画布需要的奖品icon对象，用于预加载图片
                haveTimes: 3,
                timesSrc: "static/images/page1/zi3.png",
                fontSize: parseInt(window.getComputedStyle(document.querySelector("html")).fontSize), //当前屏幕下字体大小
                alertStatus: false,
                micromessenger: true, //判断是否是微信浏览器,
                qr_url: '',
                prizes:false,
                imgsrc:""
            }
        },
        created() {
            let ajax_url = window.location.href.split('#')[0];
            let url = "http://ab.aikaka.com.cn/PublicService/Weixin/getJsSdkConfig.php", _self = this
            let params = {
                "url": url,
                "type": "GET",
                "dataType": "jsonp",
                "data": {
                    "_t": Math.random(),
                    "url": ajax_url
                },
                "success": function (res) {
                    _self.$wx.config({
                        debug: false,
                        appId: res.appId,
                        timestamp: res.timestamp,
                        nonceStr: res.nonceStr,
                        signature: res.signature,
                        jsApiList: [
                            'onMenuShareTimeline',  // 分享到朋友圈
                            'onMenuShareAppMessage',    // 分享给朋友
                            'onMenuShareQQ',    // 分享到QQ
                            'onMenuShareWeibo', // 分享到腾讯微博
                            'onMenuShareQZone', // 分享到QQ空间
                            'chooseImage', // 拍照或从手机相册中选图接口
                            'previewImage', // 预览图片接口
                            'uploadImage',  // 上传图片接口
                            'downloadImage', // 下载图片接口
                            'getNetworkType', // 获取网络状态接口
                            'openLocation', // 使用微信内置地图查看位置接口
                            'getLocation', // 获取地理位置接口
                            'startSearchBeacons', // 开启查找周边ibeacon设备接口
                            'stopSearchBeacons', // 关闭查找周边ibeacon设备接口
                            'onSearchBeacons', // 监听周边ibeacon设备接口
                            'hideOptionMenu', // 隐藏右上角菜单接口
                            'closeWindow', // 关闭当前网页窗口接口
                            'hideMenuItems', // 批量隐藏功能按钮接口
                            'hideAllNonBaseMenuItem', // 隐藏所有非基础按钮接口 
                            'showAllNonBaseMenuItem', // 显示所有功能按钮接口
                            'scanQRCode', // 调起微信扫一扫接口
                            'addCard' // 批量添加卡券接口
                        ]
                    });
                    _self.$wx.ready(function () {
                        //隐藏右上角菜单禁用分享
                        _self.$wx.hideOptionMenu()
                    })
                }
            }
            let test = this.$ajax(params)
            
            this.prizes = this.$route.query.prizes ? true:false
            this.imgsrc = this.$route.query.imgsrc ? this.$route.query.imgsrc : ""
        },
        watch: {
        },
        mounted() {
        },
        updated() {
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
    .mains{
        width:100vw;
        display: flex;
        flex-direction: column;
        .bgs{
            width:100vw;
        }
    }
</style>
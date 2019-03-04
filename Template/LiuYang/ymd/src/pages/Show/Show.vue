<template>
    <div class="loading" style="backgroundImage:url('static/images/loading/Background.jpg')" v-if="inLoading">
        <img src="static/images/loading/text.png" class="zi" alt="">
        <img src="static/images/loading/loading.gif" class="loadings" alt="">
    </div>
    <div class="mains" v-else>
        <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
        <div class="mengban" v-show="mengban"></div>
        <img :src="prizeSrc" class="bg" alt="">
        <div class="button1" @click="returnPrize"></div>
        <div class="button2" @click="showMain"></div>
        <div class="button3" @click="returnUrl"></div>
    </div>
</template>

<script>
    //图片预加载
    import { getConfig } from '../../services/getConfig';

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
                prizeNum:"",
                prizeSrc:"",
                href:"#",
                mengban:true,
                phoneType:"ios",
                showQr:""
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
            let test=this.$ajax(params)
            this.checkedRouter()
            //判断手机类型
            this.downApp()
        },
        watch: {
            '$route': 'checkedRouter'
        },
        mounted() {
            
        },
        updated() {

        },
        methods: {
            checkedRouter() {
                // 获取链接参数
                this.openId = this.$route.query.openid ? this.$route.query.openid : this.urlGet()['openid'].replace(/#\//, "")
                this.activityId = this.$route.query.activity_id ? this.$route.query.activity_id : this.activityId
                this.from = this.$route.query.from ? this.$route.query.from : this.from
                this.storeCode = this.$route.query.store_code ? this.$route.query.store_code : this.storeCode
                this.prizeNum = this.$route.query.prize? this.$route.query.prize : this.prizeNum
                // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
                if (this.openId !== "" && typeof this.openId !== 'undefined' && this.openId !== null) {
                    this.start()
                } else {
                    this.authorize()
                }
                this.mengban = true
                setTimeout(() => {
                    this.mengban = false
                }, 400);
            },
            //给蛋疼的openid专门写个获取的方法
            urlGet() {
                let aQuery = window.location.href.split("?") //取得Get参数
                let aGET = new Array()
                if (aQuery.length > 1) {
                    let aBuf = aQuery[1].split("&");
                    for (let i = 0, iLoop = aBuf.length; i < iLoop; i++) {
                        let aTmp = aBuf[i].split("=") //分离key与Value
                        aGET[aTmp[0]] = decodeURIComponent(aTmp[1])
                    }
                }
                return aGET
            },
            authorize() {
                let url = window.location.href.split('?')[0]
                let host = url + '?activity_id=' + this.activityId + '&store_code=' + this.storeCode
                window.location.href = "http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=" + host
            },
            start() {
                getConfig(res => {
                    this.config = res
                    this.music = this.config.music
                    this.imageArr = this.config.images
                    this.page = this.config.pages[1]
                    //图片预加载
                    this.loadImages(() => {
                        this.showPrize()
                    })
                }, this)
            },
            loadImages(callback) {
                let _self = this
                let oImg = new Image()
                oImg.src = this.imageArr[this.iCur]

                oImg.onload = function () {
                    _self.iCur++
                    if (_self.iCur < _self.imageArr.length) {
                        _self.loadImages(callback)
                    } else {
                        callback()
                    }
                }
            },
            showMain() {
                this.$router.replace({ path: '/', query: {openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } });
            },
            //展示中奖信息
            showPrize(){
                let num   = this.$route.query.prize
                let href = this.$route.query.myUrl.split("|")
                this.href = href[0]
                this.prizeNumber = num
                if(num == 2015){
                    //SERASE餐厅85折优惠
                    this.inLoading = false
                    this.prizeSrc = "static/images/page2/10.jpg"
                    this.showQr = href[1]
                } else if (num == 2014) {
                    //Aqua水疗7折优惠券
                    this.inLoading = false
                    this.prizeSrc = "static/images/page2/6.jpg"
                    this.showQr = href[1]
                } else if (num == 2013) {
                    //PART直营店9折优惠券
                    this.inLoading = false
                    this.prizeSrc = "static/images/page2/2.jpg"
                    this.showQr = href[1]
                } else if (num == 2012) {
                    //克迈入场7折优惠券
                    this.inLoading = false
                    this.prizeSrc = "static/images/page2/3.jpg"
                    this.showQr = href[1]
                } else if (num == 2011) {
                    //水疗服务优惠礼券
                    this.inLoading = false
                    this.prizeSrc = "static/images/page2/1.jpg"
                    this.showQr = href[1]
                } else if (num == 2010) {
                    //克迈免费入场礼券
                    this.inLoading = false
                    this.prizeSrc = "static/images/page2/5.jpg"
                    this.showQr = href[1]
                } else if (num == 2009) {
                    //百艺阁免费入场礼券
                    this.inLoading = false
                    this.prizeSrc = "static/images/page2/4.jpg"
                    this.showQr = href[1]
                } else if (num == 2008) {
                    //百乐艺术酒店住宿券
                    this.inLoading = false
                    this.prizeSrc = "static/images/page2/7.jpg"
                    this.showQr = href[1]
                } else  if (num == 2007){
                    // 豪华客房住宿券
                    let num = Math.round(Math.random() + 1)
                    if(num == 1){
                        this.inLoading = false
                        this.prizeSrc = "static/images/page2/8.jpg"
                    }else{
                        this.inLoading = false
                        this.prizeSrc = "static/images/page2/9.jpg"
                    }
                    this.showQr = href[1]
                }
            },
            //跳转中奖地址
            returnPrize(){
                // if(this.phoneType == 'ios'){
                //     window.open(this.href)
                // }else{
                //     if(this.prizeNumber == 2007){
                //         window.open(this.showQr)
                //     }else{
                //         this.$router.replace({ path: '/Onepiece', query: { prizes: 1, imgsrc: this.showQr } });
                //     }
                // }
                if (this.prizeNumber == 2007) {
                    window.open(this.showQr)
                } else {
                    this.$router.replace({ path: '/Onepiece', query: { prizes: 1, imgsrc: this.showQr } });
                }
            },
            returnUrl(){
                window.location.href = "https://www.p-city.com/front/event?M1=OE"
            },
            downApp() {
                let ua = navigator.userAgent.toLowerCase();
                //android终端
                let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
                //ios终端
                let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    //ios
                    this.phoneType = 'ios'
                } else {
                    //android
                    this.phoneType = 'android'
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "Show";
</style>
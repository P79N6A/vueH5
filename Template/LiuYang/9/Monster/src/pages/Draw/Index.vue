<template>
    <div class="main">
        <div ref="page" class="page" :style="{backgroundImage:'url('+ this.page.bg_image +')'}">
            <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
            <img src="static/page1/logo.png" alt="" class="title">
            <img :src="this.prizeInfo.prize_img" alt="" @click="getPrize" class="alert">
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import Loading from '../../components/Loading';
    //音乐播放组件
    import myMusic from '../../components/playMusic';
    //规则弹窗
    import alertRules from '../../components/alertRules';
    export default {
        components: {
            Loading,
            alertRules
        },
        data() {
            return {
                bounce:true,
                storeCode:"",
                //---------------模板链接数据 end-------------
                config: {},
                loading: false,
                inLoading: true, //加载状态
                images: {}, //图片集--用作图片展示
                iCur: 0, //图片加载的序号
                music: {},
                rulesId: 0,
                hasShowRules: false, //是否展示弹窗规则
                canGetPrize: false,  //时候可以抽奖
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
                imagesArr: [], //画布需要的奖品icon对象，用于预加载图片
                prizeImg: {},
                getSelect: ""
            }
        },
        computed: {
            ...mapState({
                imageArr: state => state.images,
                page: state => state.pages[1],
                activityId: state => state.activityId,
                sessionKey: state => state.sessionKey,
                couponBagHost: state => state.coupon_bag_host
            })
        },
        beforeCreate: function () {
        },
        created() {
            let ajax_url = window.location.href.split('#')[0];
            let url = "https://ab.aikaka.com.cn/PublicService/Weixin/getJsSdkConfig.php", _self = this
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
                this.openId = this.$route.query.openid ? this.$route.query.openid : this.urlGet()['openid'] ? this.urlGet()['openid'].replace(/#\//, "") : ""
                this.storeCode = this.$route.query.store_code ? this.$route.query.store_code : this.storeCode
                this.getSelect = this.$route.query.get_select ? this.$route.query.get_select : this.urlGet()['get_select'] ? this.urlGet()['get_select'].replace(/#\//, "") : ""
                // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
                if (this.getSelect !=="" && this.openId !== "" && typeof this.openId !== 'undefined' && this.openId !== null) {
                    this.start()
                } else {
                    this.authorize()
                }
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
                window.location.href = "https://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=" + host
            },
            start() {
                this.allPrize = this.page.prize_img_box
                
                if (this.getSelect == 2030) {
                    //MonsterEnergy免费
                    this.prizeInfo = this.allPrize[3]
                } else if (this.getSelect == 2029) {
                    //MonsterEnergy3元
                    this.prizeInfo = this.allPrize[2]
                } else if (this.getSelect == 2028) {
                    //MonsterEnergy免费
                    this.prizeInfo = this.allPrize[3]
                } else if (this.getSelect == 2027) {
                    //Monster一等奖
                    this.prizeInfo = this.allPrize[1]
                } else if (this.getSelect == 2026) {
                    //Monster特等奖
                    this.prizeInfo = this.allPrize[0]
                }
                this.$nextTick(() => {
                })
            },
            //点击跳转到提交信息界面
            getPrize() {
                if (this.getSelect == 2030) {
                    //MonsterEnergy免费(可以核销)
                    this.$router.replace({ path: '/CouponCheck', query: { openid: this.openId, coupon_code: localStorage[this.sessionKey] } })
                } else if (this.getSelect == 2029) {
                    //MonsterEnergy3元
                    this.$router.replace({ path: '/Coupon', query: { openid: this.openId, coupon_code: localStorage[this.sessionKey], show_code: 1 } })
                } else if (this.getSelect == 2028) {
                    //MonsterEnergy免费
                    this.$router.replace({ path: '/CouponTest', query: { openid: this.openId, coupon_code: localStorage[this.sessionKey]} })
                } else if (this.getSelect == 2027) {
                    //Monster一等奖
                    this.$router.replace({ path: '/Table', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } })
                } else if (this.getSelect == 2026) {
                    //Monster特等奖
                    this.$router.replace({ path: '/Table', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } })
                }


                // if(this.prizeInfo.item_id && this.prizeInfo.item_id == 2){
                    
                // } else if (this.prizeInfo.item_id && this.prizeInfo.item_id == 3) {
                //     this.$router.push({ path: '/Coupon', query: { openid: this.openId, coupon_code: localStorage[this.sessionKey]} })
                // } else {
                //     this.$router.replace({ path: '/Table', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } })
                // }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "Index";
</style>
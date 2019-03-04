<template>
    <div class="main">
        <div ref="page" class="page" >
            <div class="title">
                卡券详情
            </div>
            <div class="info">
                <p>1.每张卡券仅可兑换一次</p>
                <p>2.请在卡券有效期内使用</p>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    export default {
        components: {
        },
        data() {
            return {
                bounce:true,
                coupon_code:"", //默认卡券ID
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
                prizeInfo: {},
                allPrize: {},  //全部的奖品信息                // ---------------------私有属性-----------------------
                showArr: [210, 270, 330, 390, 450, 510], //奖盘排列序号,
                imagesArr: [], //画布需要的奖品icon对象，用于预加载图片
                prizeImg:{},
                has_show_rules:true,
                hasShowSystemAlert: false,
                alertInfo:"",
                couponInfo:{},
                //---------------系统提示信息 -------------
                alertInfo: "",    //系统错误提示
                hasShowSystemAlert: false,    //系统弹窗状态
                alertType:0
            }
        },
        computed: {
            ...mapState({
                imageArr: state => state.images,
                page: state => state.pages[1],
                activityId: state => state.activityId,
                sessionKey: state => state.sessionKey,
                couponBagHost: state => state.couponBagHost
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
                this.coupon_code = this.$route.query.coupon_code ? this.$route.query.coupon_code : this.urlGet()['coupon_code'] ? this.urlGet()['coupon_code'].replace(/#\//, "") : ""
                // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
                if (this.coupon_code !== "" && this.openId !== "" && typeof this.openId !== 'undefined' && this.openId !== null) {
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
                window.location.href = "http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=" + host
            },
            start() {
                let url = "/cocacola/Acmp/AcmpApi/couponRecord/info", params = {}
                url += '?coupon_code='+ this.coupon_code+'&openid='+this.openId
                this.$axios({
                    method: 'get',
                    url: url,
                    data: params
                }).then(result => {
                    if(result.data.return_code == 200){
                        this.coupon_code = result.data.data.coupon_code
                        this.$nextTick(() => {
                            let code = this.$refs.barcode
                            let number = this.coupon_code
                            this.$jsbarcode(code, number, {
                                height: 50
                            })
                        })
                    }else{
                        //出错，系统提示弹框
                        this.alertInfo = result.data.return_msg
                        this.hasShowSystemAlert = true
                    }
                })
                
            },
            //点击跳转到提交成功界面
            getPrize() {
                
            },
            //点击系统弹窗消失
            rulesStatus(){
                this.hasShowSystemAlert = false
            },
            returnPage(){
                window.location.href = "http://acmp.aikaka.cc/cocacola/CouponBagV2/webcoupon_detail.html"
            },
            //点击核销
            verification(){
                let url = "/cocacola/Acmp/AcmpApi/consume/scrape", params = {}
                params.coupon_code = this.coupon_code
                this.$axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(result => {
                    console.log(result.data)
                    if (result.data.return_code == 200) {
                        this.alertType = 1
                        this.alertInfo = result.data.return_msg
                        this.hasShowSystemAlert = true
                    } else {
                        //出错，系统提示弹框
                        this.alertInfo = result.data.return_msg
                        this.hasShowSystemAlert = true
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    @import "Detail";
</style>
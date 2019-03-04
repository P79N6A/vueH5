<template>
    <div class="loading" v-if="inLoading">
        <img src="../../assets/loading-bars.svg" />
        <!-- <img src="static/images/loading.gif" alt=""> -->
    </div>
    <div class="main" v-else>
        <div ref="page" class="page" :style="{backgroundImage:'url('+ this.page.bg_image +')'}">
            <img src="static/page1/logo1.png" alt="" class="logo">
            <img src="static/page1/logo.png" alt="" class="title">
            <img class="zi" src="static/page3/zi.png" />
            <div class="myTable">
                <myTable @submitInfo="submitInfo"></myTable>
            </div>
        </div>
        <alertSystem :content="alertInfo" v-show="hasShowSystemAlert" @rulesStatus="rulesStatus"></alertSystem>
        <showPrize :prize="prizeInfo" v-if="hasShowPrizeResult" @showStatus="getPrizeStatus"></showPrize>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import Loading from '../../components/Loading';
    //音乐播放组件
    //import myMusic from '../../components/playMusic';
    //大转盘组件引入
    import myTable from '../../components/myTable';
    //提交结果弹窗
    import showPrize from '../../components/showPrize';
    //系统弹框
    import alertSystem from '../../components/alertSystem';
    export default {
        components: {
            Loading,
            myTable,
            showPrize
        },
        data() {
            return {
                //---------------模板链接数据 end-------------
                config: {},
                loading: false,
                inLoading: true, //加载状态
                sliderAlert: true,
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
                prizeInfo: {},  //弹窗的中奖信息
                allPrize: {},  //全部的奖品信息                // ---------------------私有属性-----------------------
                has_show_rules: true,
                bounce:true,
                prizeImg: {},   //大转盘的配置信息
                GetSelect: "",   //coupon的id
                hasShowSystemAlert: false,
                alertInfo: ""    //系统弹窗信息
            }
        },
        computed: {
            ...mapState({
                imageArr: state => state.images,
                page: state => state.pages[2],
                storeCode: state => state.storeCode,
                activityId: state => state.activityId,
                sessionKey: state => state.sessionKey,
                couponBagHost: state => state.couponBagHost
            })
        },
        beforeCreate: function () {
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
        },
        watch: {
            '$route': 'checkedRouter'
        },
        mounted() {
            document.getElementsByTagName("body")[0].style.height = document.body.clientHeight
            document.getElementsByTagName("html")[0].style.height = document.body.clientHeight
        },
        updated() {
        },
        methods: {
            checkedRouter() {
                //vuex里保存的变量一刷新就会没有了，所以页面间传值尽量用参数，不用vuex,vuex最好用在多层组件之间的传值
                this.openId = this.$route.query.openid ? this.$route.query.openid : this.urlGet()['openid'] ? this.urlGet()['openid'].replace(/#\//, "") : this.openId
                // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
                if (this.openId !== "" && typeof this.openId !== 'undefined' && this.openId !== null) {
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
                this.allPrize = this.page.prize_img_box
                this.prizeInfo = this.allPrize[0]
                this.loadImages(() => {
                    this.inLoading = false
                    this.$nextTick(() => {
                        this.$refs.page.style.height = document.body.clientHeight + 'px'
                    })
                })
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
            //点击跳转到卡券页面
            getPrize() {
                this.$router.replace({ path: '/Draw', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } });
            },
            submitInfo(submitInfo){
                let coupon_code = localStorage[this.sessionKey]
                let url = "/cocacola/Acmp/AcmpApi/prize/updateUserInfo", sub_data = {}
                sub_data.buyer_name = submitInfo.buyer_name
                sub_data.buyer_phone = submitInfo.buyer_phone
                sub_data.buyer_addr = submitInfo.buyer_idcard
                sub_data.coupon_code = coupon_code
                this.$axios({
                    method: 'post',
                    url: url,
                    data: sub_data
                }).then(result => {
                    if (result.data.return_code == 200) {
                        //快速核销掉
                        let urls = "/cocacola/Acmp/AcmpApi/consume/scrape"
                        this.$axios({
                            method: 'post',
                            url: urls,
                            data: sub_data
                        }).then(result => {
                            //$("#loadingToast").hide();
                            if (result.data.return_code == 200) {
                                this.hasShowPrizeResult = true
                                return
                            } else {
                                this.alertInfo = result.data.return_msg
                                this.hasShowSystemAlert = true
                            }
                        })
                    }else{
                        this.alertInfo = result.data.return_msg
                        this.hasShowSystemAlert = true
                    }
                })
            },
            getPrizeStatus(){
                this.$wx.closeWindow()
            },
            rulesStatus() {
                this.hasShowSystemAlert = false
            }
        }
    }
</script>

<style scoped lang="less">
    @import "Index";
</style>
<template>
    <div class="loading" v-if="inLoading">
        <img src="../../assets/loading-bars.svg" />
        <!-- <img src="static/images/loading.gif" alt=""> -->
    </div>
    <div class="main" v-else >
        <div class="page" ref="page" :style="{backgroundImage:'url('+ this.page.bg_image +')'}">
            <!-- <div v-show="sliderAlert" class="slider">
                <Slider @sliderStatus="sliderStatus"></Slider>
            </div> -->
            <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
            <div class="mains animate-wrapper2">
                <img src="static/page1/ren.png" alt="" class="images">
            </div>
            <div class="title animate-wrapper1">
                <img src="static/page1/logo.png" alt="" class="images">
            </div>
            <div class="left animate-wrapper5" @click="getCenterPage">
                个人中心
            </div>
            <div class="right animate-wrapper5" @click="getRulesPage">
                活动详情
            </div>
            <div class="button1 animate-wrapper4">
                <img src="static/page1/anniu.png" alt="" @click="getPrizes" class="images">
            </div>
        </div>
        <Loading v-show="showLoading"></Loading>
        <alertSystem :content="alertInfo" v-show="hasShowSystemAlert" @rulesStatus="rulesStatus"></alertSystem>
        <!-- <alertRules :content="page.rules[rulesId]" v-show="has_show_rules" @rulesStatus="getRulesStatus"></alertRules> -->
    </div>
</template>

<script>
    
    import { mapState, mapActions } from 'vuex'
    import Loading from '../../components/Loading';
    //图片预加载
    
    //import { getConfig } from '../../services/getConfig';
    //音乐播放组件
    import myMusic from '../../components/playMusic';
    //规则弹窗
    import alertRules from '../../components/alertRules';
    //slider
    import Slider from '../../components/Slider';
    //import Slider from '../../components/flipOver';
    //系统弹框
    import alertSystem from '../../components/alertSystem';
    export default {
        components: {
            Loading,
            alertRules,
            myMusic,
            Slider,
            alertSystem
        },
        data() {
            return {
                storeCode:"",
                //---------------模板链接数据 end-------------
                config: {},
                loading: false,
                inLoading: true, //加载状态
                sliderAlert:true,
                iCur: 0, //图片加载的序号
                music: {},
                rulesId: 0,
                hasShowRules: false, //是否展示弹窗规则
                canGetPrize:false,  //时候可以抽奖
                hasShowPrizeResult: false, //是否展示抽奖结果
                inDraw: false, //是否处于抽奖状态
                rotationAngle:0,
                hasGetPrize: false, // 当前轮数是否已抽奖
                prizeDrawNumberText: '', //抽奖次数提示语
                prizeDrawNumber: 5, //默认抽奖次数
                prize: -1, //默认奖品
                coupon_code:"", //默认卡券ID
                prizeInfo: {},
                allPrize: {},  //全部的奖品信息                // ---------------------私有属性-----------------------
                has_show_rules:true,
                showLoading: false,
                //---------------系统提示信息 -------------
                alertInfo:"",    //系统错误提示
                hasShowSystemAlert: false    //系统弹窗状态
            }
        },
        computed: {
            ...mapState({
                imageArr: state => state.images,
                page: state => state.pages[0],
                activityId: state => state.activityId,
                openId: state => state.openId,
                sessionKey: state=>state.sessionKey
            })
        },
        beforeCreate: function () {
        },
        created() {
            let ajax_url = window.location.href.split('#')[0];
            let url = "https://ab.aikaka.com.cn/PublicService/Weixin/getJsSdkConfig.php",_self = this
            let params = {
                "url":url,
                "type":"GET",
                "dataType":"jsonp",
                "data":{
                    "_t": Math.random(),
                    "url": ajax_url
                },
                "success":function(res){
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
            // '$route': 'checkedRouter'
        },
        mounted() {
        },
        updated(){
        },
        methods: {
            ...mapActions([
                'changeOpenid',
                'changeActivityId'
            ]),
            checkedRouter() {
                // 获取链接参数
                let openId = this.$route.query.openid ? this.$route.query.openid : this.urlGet()['openid'] ? this.urlGet()['openid'].replace(/#\//, "") : ""
                if(openId instanceof Array){
                    openId = openId[0]
                }
                this.changeOpenid(openId)
                let activityId = this.$route.query.activity_id ? this.$route.query.activity_id: this.activityId
                this.changeActivityId(activityId)
                this.storeCode = this.$route.query.store_code ? this.$route.query.store_code : this.urlGet()['store_code'] ? this.urlGet()['store_code'].replace(/#\//, "") : this.storeCode
                //console.log(this.openId)
                //链接是否带有 xjjOpenId ？ 直接进入start ： 授权
                if (this.openId !== "" && typeof this.openId !== 'undefined' && this.openId !== null) {
                    this.start()
                } else {
                    this.authorize()
                }
            },
            //给蛋疼的openid专门写个获取的方法
            urlGet(){
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
            authorize(){
                let url = window.location.href.split('?')[0]
                let host = url + '?activity_id=' + this.activityId + '&store_code='+ this.storeCode
                window.location.replace("http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url="+ host)
            },
            start(){
                this.loadImages(()=>{
                    this.inLoading = false
                    this.$nextTick(() => {
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
            //点击跳转到抽奖页面
            getPrize(){
                this.$router.replace({ path: '/Draw', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } });
            },
            rulesStatus(item){
                this.hasShowSystemAlert = false
            },
            //点击跳转规则页面
            getRulesPage(){
                this.$router.replace({ path: '/Rules', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } })
            },
            //点击跳转个人中心页面
            getCenterPage(){
                this.$router.replace({ path: '/Center', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } })
            },
            //点击抽奖
            getPrizes(){
                this.showLoading = true
                let url = "/cocacola/Acmp/AcmpApi/prize/lottery", params = {}
                params.activity_id = this.activityId
                params.store_code = this.storeCode
                params.openid = this.openId
                this.$axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(result => {
                    this.showLoading = false
                    //判断是否中奖
                    if (result.data.return_code != 200) {
                        if(result.data.return_msg == '谢谢参与'){
                            this.$router.replace({ path: '/None', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } })
                        }else{
                            this.alertInfo = result.data.return_msg
                            this.hasShowSystemAlert = true
                        }
                    } else {
                        this.GetSelect = result.data.data.coupon.id
                        let coupon_code = result.data.data.coupon_code, item = 1
                        //把获取的卡券编号存入localstorage
                        localStorage[this.sessionKey] = coupon_code
                        
                        //直接跳转界面，带上GetSelect参数
                        this.$router.replace({ path: '/Draw', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode, get_select: this.GetSelect } })
                        
                    }
                })
            }

        }
    }
</script>

<style scoped lang="less">
    @import "Index";
</style>
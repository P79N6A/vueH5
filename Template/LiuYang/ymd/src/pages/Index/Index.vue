<template>
    <div class="loading" style="backgroundImage:url('static/images/loading/Background.jpg')" v-if="inLoading">
        <img v-if="haveOpenid" src="static/images/loading/text.png" class="zi" alt="">
        <img v-if="haveOpenid" src="static/images/loading/loading.gif" class="loadings" alt="">
    </div>
    <div class="mains" v-else>
        <div class="coupon">
            <div v-for="(item, index) in couponArr" @click="result(index)"
                alt="" :class="[resultNum === index?'click':'','item item'+index]">
                <img :src="'static/images/page1/'+ index +'.jpg'" class="coupon-img" alt="">
                <div class="button1" v-if="index==4">
                    <p>点击任意一张</p>
                    <p>开始抽奖</p>
                </div>
            </div>
        </div>
        <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
        <img src="static/images/page1/main.jpg" class="bg" alt="">
        <img v-if="micromessenger" :src="timesSrc" alt="" class="zi">
        
        <div class="button2" @click="returnPrize"></div>
        <div class="alert" v-show="alertStatus" >
            <div class="content">
                <div class="title">
                    <img src="static/images/download.png" class="icon" alt="">很遗憾
                </div>
                <div class="mess" v-html="alert.mess"></div>
                <hr style="height:1px;width:100%;border:none;border-top:1px solid #E4E4E4;"/>   
                <div class="footer" @click="hiddenAlertr">
                    知道了
                </div>
            </div>
        </div>
        <!-- <div id="loadingToast" class="weui_loading_toast"  v-show="!canGetPrize" @touchmove.prevent>
            <div class="weui_mask_transparent"></div>
            <div class="weui_toast">
                <div class="weui_loading">
                    <div class="weui_loading_leaf weui_loading_leaf_0"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_1"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_2"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_3"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_4"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_5"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_6"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_7"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_8"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_9"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_10"></div>
                    <div class="weui_loading_leaf weui_loading_leaf_11"></div>
                </div>
                <p class="weui_toast_content">正在抽卡中</p>
            </div>
        </div> -->
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
                from: 1,
                storeCode: 'AIKAKATEST002',
                acmp_host:'http://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/',
                coupon_bag_host:'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/',
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
                canGetPrize:true,  //时候可以抽奖
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
                showArr: [210, 270, 330, 390, 450, 510], //奖盘排列序号,
                imagesArr: [],//画布需要的奖品icon对象，用于预加载图片
                haveTimes:3,
                timesSrc:"static/images/page1/zi3.png",
                fontSize: parseInt(window.getComputedStyle(document.querySelector("html")).fontSize), //当前屏幕下字体大小
                alertStatus: false,
                micromessenger:true, //判断是否是微信浏览器,
                num:"",
                alert:{
                    mess:"超出每人每天参与次数 <br /> 欢迎明天继续参与"
                },
                couponArr:[
                    "static/images/page1/0.jpg",
                    "static/images/page1/1.jpg",
                    "static/images/page1/2.jpg",
                    "static/images/page1/3.jpg",
                    "static/images/page1/4.jpg",
                    "static/images/page1/5.jpg",
                    "static/images/page1/6.jpg",
                    "static/images/page1/7.jpg",
                    "static/images/page1/8.jpg"
                ],
                haveOpenid:false
            }
        },
        created() {
            let ajax_url = window.location.href.split('#')[0];
            let url = "http://ab.aikaka.com.cn/PublicService/Weixin/getJsSdkConfig.php",_self = this
            let params = {
                "url":url,
                "type":"GET",
                "dataType":"jsonp",
                "data":{
                    "_t": Math.random(),
                    "url": ajax_url
                },
                "success":function(res){
                    console.log(res)
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
            //判断是否在微信浏览器中
            this.micromessenger = this.downApp()
            this.checkedRouter()
        },
        watch: {
            '$route': 'checkedRouter',
            haveTimes:'changeZi'
        },
        mounted() {
            setTimeout(() => {
                this.inDraw = true
            }, 3200);
        },
        updated(){
        },
        computed:{
            resultNum(){
                return this.num
            }
        },
        methods: {
            checkedRouter() {
                // 获取链接参数
                if(this.micromessenger){
                    
                    this.openId = this.$route.query.openid ? this.$route.query.openid : this.urlGet()['openid'] ? this.urlGet()['openid'].replace(/#\//, "") : ""
                    this.activityId = this.$route.query.activity_id ? this.$route.query.activity_id : this.activityId
                    this.from = this.$route.query.from ? this.$route.query.from : this.urlGet()['from'] ? this.urlGet()['from'].replace(/#\//, "") : this.from
                    this.storeCode = this.$route.query.store_code ? this.$route.query.store_code : this.storeCode
                    // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
                    if (this.openId !== "" && typeof this.openId !== 'undefined' && this.openId !== null) {
                        this.haveOpenid = true
                        this.start()
                    } else {
                        this.authorize()
                    }
                }else{
                    this.activityId = this.$route.query.activity_id ? this.$route.query.activity_id : this.activityId
                    this.from = this.$route.query.from ? this.$route.query.from : this.urlGet()['from'] ? this.urlGet()['from'].replace(/#\//, "") : this.from
                    this.storeCode = this.$route.query.store_code ? this.$route.query.store_code : this.storeCode
                    this.openId = "unkown"
                    this.start()
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
            authorize(){
                let url = window.location.href.split('?')[0]
                let host = url + '?from=' + this.from+'&activity_id=' + this.activityId + '&store_code='+ this.storeCode
                window.location.href="http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url="+ host
            },
            start() {
                getConfig(res => {
                    this.config = res
                    this.music = this.config.music
                    this.imageArr = this.config.images
                    this.page = this.config.pages[0]
                    //图片预加载
                    this.loadImages(() => {
                        this.inLoading = false
                        this.getRecord()
                        //判断抽奖次数
                        this.getPrizeTime()
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
            showPrize(){
                this.openPrize()
            },
            //点击马上开礼
            openPrize(index) {
                if(!this.micromessenger){
                    // this.$set(this.alert, 'mess', '请在微信浏览器中打开此页面')
                    // this.alertStatus = true
                    this.$router.push({ path: '/Qrcode', query: { from: this.from}})
                    //this.$router.replace({ path: '/Qrcode'});
                }
                if (this.canGetPrize) {
                    this.canGetPrize = false
                    let url = "/cocacola/Acmp/AcmpApi/prize/lottery", params = {}
                    params['openid'] = this.openId
                    params['activity_id'] = this.activityId
                    params['store_code'] = this.storeCode
                    params['from'] = this.from
                    this.$axios({
                        method: 'post',
                        url: url,
                        data: params
                    }).then(result => {
                        this.canGetPrize = true
                        if (result.data.return_code != 200) {
                            this.haveTimes = 0
                            this.timesSrc = "static/images/page1/zi0.png"
                            //this.$set(this.alert, 'mess', '超出每人每天参与次数 < br /> 欢迎明天继续参与')
                            setTimeout(() => {
                                this.alertStatus = true
                            }, 600);
                        } else {
                            let lastTime = this.getTimeStr()
                            if (this.haveTimes > 0) {
                                this.haveTimes--
                            }
                            localStorage.setItem("time_" + lastTime, this.haveTimes)
                            this.num = index
                            setTimeout(() => {
                                let GetSelect = result.data.data.coupon.id //从后台拿数据
                                let url = result.data.data.coupon.consume_url
                                this.$router.replace({ path: '/Show', query: { prize: GetSelect, myUrl: url, openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } });
                            }, 600);
                        }
                    })
                }
            },
            //跳转中奖地址
            returnPrize() {
                window.location.href = "https://www.p-city.com/?language=ZNCN"
            },
            //改变提示抽奖次数
            changeZi(){
                if(this.haveTimes == 3){
                    this.timesSrc="static/images/page1/zi3.png"
                }else if(this.haveTimes == 2){
                    this.timesSrc = "static/images/page1/zi2.png"
                } else if (this.haveTimes == 1) {
                    this.timesSrc = "static/images/page1/zi1.png"
                } else{
                    this.timesSrc = "static/images/page1/zi0.png"
                }
            },
            //获取当天最晚的时间错
            getTimeStr() {
                return Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1))
            },
            getPrizeTime(){
                let lastTime = this.getTimeStr()
                let times = localStorage.getItem("time_" + lastTime)
                if(times){
                    this.haveTimes = times
                }else{
                    localStorage.setItem("time_" + lastTime, 3)
                }
            },
            hiddenAlertr(){
                this.alertStatus = false
            },
            //判断是否在微信浏览器中
            downApp(){
                 let ua = navigator.userAgent.toLowerCase()
                 return (/micromessenger/.test(ua)) ? true : false;
            },
            //点击卡片
            result(index) {
                if (!this.inDraw) {
                    return
                }
                this.openPrize(index)
            },
            //后添加的传递参数接口
            getRecord(){
                let url = "/cocacola/Acmp/AcmpApi/share/record", params = {}
                params['openid'] = this.openId
                params['activity_id'] = this.activityId
                params['way'] = 'message'
                params['result'] = this.from
                this.$axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(result => {
                    console.log(result)
                })
            }
        }
        
    }
</script>

<style scoped lang="less">
    @import "Index";
    @import "weui";
</style>
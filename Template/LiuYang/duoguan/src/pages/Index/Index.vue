<template>
    <div class="loading" v-if="inLoading">
        <img src="../../assets/loading-bars.svg" />
    </div>
    <swiper class="main" v-else :options="swiperOption" ref="mySwiper">
        <swiper-slide class="page swiper-no-swiping" :style="{backgroundImage:'url('+ this.page1.bg_image +')'}">
            <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
            <div class="mains">
                <img :src="this.page1.button" class="button" alt="" @click="openPrize" />
                <div class="rules" @click="showAlert">活动规则</div>
                <alertRules :content="page1.rules[rulesId]" v-if="hasShowRules" @rulesStatus="getRulesStatus" ></alertRules>
                <showPrize :prize="prizeInfo" v-if="hasShowPrizeResult" @showStatus="getPrizeStatus" @showRulesStatus="showPrizeRules"></showPrize>
            </div>
        </swiper-slide>

        <swiper-slide class="page swiper-no-swiping" :style="{backgroundImage:'url('+ this.page2.bg_image +')'}">
            <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
            <div class="mytables">
                <myTable @submitInfo="submitInfo"></myTable>
            </div>
        </swiper-slide>


        <swiper-slide class="page swiper-no-swiping" :style="{backgroundImage:'url('+ this.page3.bg_image +')'}">
            <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
        </swiper-slide>
    </swiper>
</template>

<script>
    
    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    import Loading from '../../components/Loading';
    //图片预加载
    import { getConfig } from '../../services/getConfig';
    //音乐播放组件
    import myMusic from '../../components/playMusic';
    //规则弹窗
    import alertRules from '../../components/alertRules';
    //抽奖结果弹窗
    import showPrize from '../../components/showPrize';
    //提交用户信息
    import myTable from '../../components/myTable';
    
    export default {
        components: {
            Loading,
            alertRules,
            myMusic,
            showPrize,
            myTable
        },
        data() {
            return {
                // ---------------------共用属性-----------------------
                xjjOpenId: '',
                openId: '',
                activityId: '1227',
                from: '',
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
                showArr: [210, 270, 330, 390, 450, 510], //奖盘排列序号,
                imagesArr: [],//画布需要的奖品icon对象，用于预加载图片
                fontSize: parseInt(window.getComputedStyle(document.querySelector("html")).fontSize), //当前屏幕下字体大小
                swiperOption: {
                    // swiper configs 所有的配置同swiper官方api配置
                    autoplay:false,
                    notNextTick: true,//notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
                    direction: 'vertical',//水平方向移动
                    grabCursor: true,//鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状
                    setWrapperSize: true,//Swiper使用flexbox布局(display: flex)，开启这个设定会在Wrapper上添加等于slides相加的宽或高，在对flexbox布局的支持不是很好的浏览器中可能需要用到。
                    autoHeight: true,//自动高度。设置为true时，wrapper和container会随着当前slide的高度而发生变化
                    slidesPerView: 1,//设置slider容器能够同时显示的slides数量(carousel模式)。可以设置为数字（可为小数，小数不可loop），或者 'auto'则自动根据slides的宽度来设定数量。loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides。
                    
                    resistanceRatio: 0,//抵抗率。边缘抵抗力的大小比例。值越小抵抗越大越难将slide拖离边缘，0时完全无法拖离。本业务需要
                    observeParents: true,//将observe应用于Swiper的父元素。当Swiper的父元素变化时，例如window.resize，Swiper更新
                    height: document.documentElement.clientHeight
                },
                swiperPages:0
                // trunplatConfig: {
                //     outsideRadius:20, //把画canvas的区域分成20个同心圆，以下三个属性填写其所占的同心圆的个数
                //     insideRadius:7,
                //     textRadius:15,
                //     zpBgImg:"https://download.aikaka.com.cn/003a3d58989af3a0f07370648e9b4ea6?f=png",
                //     color: ["#283B8A", "#17EDF8", "#17F83A", "#F1F817", "#F89617", "#F81717"],
                //     fontColor:["ffffff", "ffffff", "ffffff", "ffffff", "ffffff", "ffffff"],
                //     prizes:["一等奖", "二等奖", "三等奖||6666", "四等奖||ignore", "五等奖||逗你玩", "六等奖"]
                // }
                //trunplatConfig:{}
            }
            
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper
            }
        },
        beforeCreate: function () {
            document.getElementsByTagName("body")[0].style.height = document.body.clientHeight
            document.getElementsByTagName("html")[0].style.height = document.body.clientHeight
        },
        created() {
            console.log('ok')
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
                    console.log(res)
                    console.log(_self.$wx)
                    _self.$wx.config({
                        debug: true,
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
            console.log(params)
            let test=this.$ajax(params)
            this.checkedRouter()
        },
        watch: {
            '$route': 'checkedRouter'
        },
        mounted() {
            
            //console.log('this is current swiper instance object', this.swiper)
            //this.swiper.slideTo(3, 1000, false)
        },
        updated(){
        },
        methods: {
            checkedRouter() {
                // 获取链接参数
                this.openId = this.$route.query.openid ? this.$route.query.openid:this.urlGet()['openid'].replace(/#\//, "")
                this.activityId = this.$route.query.activity_id ? this.$route.query.activity_id: this.activityId
                this.from = this.$route.query.from ? this.$route.query.from: this.from
                this.storeCode = this.$route.query.store_code ? this.$route.query.store_code: this.storeCode
                // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
                if (this.openId !== "" && typeof this.openId !== 'undefined' && this.openId !== null) {
                    this.start()
                } else {
                    this.authorize();
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
                let host = url + '?activity_id=' + this.activityId + '&store_code='+ this.storeCode
                window.location.href="http://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url="+ host
            },
            start() {
                getConfig(res => {
                    this.config = res
                    this.music = this.config.music
                    this.imageArr = this.config.images
                    this.page1 = this.config.pages[0]
                    this.page2 = this.config.pages[1]
                    this.page3 = this.config.pages[2]
                    this.allPrize = this.config.newImage
                    //this.trunplatConfig = this.config.trunplatConfig
                    //图片预加载
                    this.loadImages(() => {
                        this.inLoading = false
                        this.loadSwiper()
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
            //加载swiper
            loadSwiper(){
                this.$nextTick(() => {
                    this.getOldCoupon(()=>{
                        if (this.canGetPrize && this.swiperPages == 1) {
                            this.swiper.slideTo(1)
                        }
                    })
                })
            },
            //弹规则框
            alertRules(page = 0){
                let content = this.pages[pages].content

            },
            //点击领奖的弹框规则
            showPrizeRules(item){
                if(item){
                    this.hasShowRules = true
                    this.rulesId = 1
                }
            },
            //点击领取奖品
            getPrizeStatus(item){
                this.hasShowPrizeResult = item
                this.canGetPrize = true     //设置开奖按钮可点击
                let GetSelect = this.prize, coupon_bag_host = this.coupon_bag_host
                if (GetSelect == 1996) {
                    //戴森吹风机一个
                    this.swiper.slideTo(1)
                    //localStorage.setItem("duoguan_coupon_code", this.coupon_code)
                } else if (GetSelect == 1997) {
                    //198元游戏大礼包,跳转卡券页面
                    window.location.href = coupon_bag_host + 'webcouponthird_party.html' + "?coupon_code=" + this.coupon_code + "&openid=" + this.openId
                } else if (GetSelect == 1998) {
                    //18元游戏礼包,跳转卡券页面
                    window.location.href = coupon_bag_host + 'webcouponthird_party.html' + "?coupon_code=" + this.coupon_code + "&openid=" + this.openId
                }
            },
            //点击弹出活动规则
            showAlert(){
                this.rulesId = 0
                this.hasShowRules = true
            },
            getRulesStatus(item){
                this.hasShowRules = item
            },
            //点击马上开礼
            openPrize(){
                console.log(this.canGetPrize)
                if(this.canGetPrize){
                    this.canGetPrize = false
                    let _self = this
                    let url = "/cocacola/Acmp/AcmpApi/prize/lottery", params = {}
                    params['openid'] = this.openId
                    params['activity_id'] = this.activityId
                    params['store_code'] = this.storeCode
                    
                    this.$axios({
                        method: 'post',
                        url: url,
                        data: params
                    }).then(result => {
                        if (result.data.return_code != 200) {
                            if (result.return_msg == "超出每人每天参与次数，欢迎明天继续参与") {
                                //my_alert("confirm_error", "很遗憾", "超出每人每天参与次数", "欢迎明天继续参与", ["知道啦"], ["green"], function () { });
                            } else {
                                this.hasShowPrizeResult = true
                                this.prizeInfo = this.allPrize.prize_img_box[0]
                            }
                        } else {
                            let GetSelect = result.data.data.coupon.id //从后台拿数据
                            let coupon_code = result.data.data.coupon_code
                            this.prize = GetSelect
                            this.coupon_code = coupon_code
                            if (GetSelect == 1996) {
                                //戴森吹风机一个
                                this.prizeInfo = this.allPrize.prize_img_box[1]
                            } else if (GetSelect == 1997) {
                                //198元游戏大礼包
                                this.prizeInfo = this.allPrize.prize_img_box[2]
                            } else if (GetSelect == 1998) {
                                //18元游戏礼包
                                this.prizeInfo = this.allPrize.prize_img_box[3]
                            } else {
                                //xiexie
                                this.prizeInfo = this.allPrize.prize_img_box[0]
                            }
                            this.hasShowPrizeResult = true
                        }
                    })
                }
            },
            //弹窗抽奖结果
            showPrize(prize){
                console.log(prize)
            },
            //表单验证成功
            submitInfo(value){
                let url = "/cocacola/Acmp/AcmpApi/prize/updateUserInfo", params = value
                if(this.coupon_code.length == 0){
                    return
                }
                params['coupon_code'] = this.coupon_code
                this.$axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(result => {
                    if (result.data.return_code == 200) {
                        //核销卡券
                        this.checkedCoupon(params)
                        //localStorage.removeItem("duoguan_coupon_code")
                    }
                })
            },
            checkedCoupon(params){
                //快速核销掉
                let url = "/cocacola/Acmp/AcmpApi/consume/scrape"
                this.$axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(result => {
                    if (result.data.return_code == 200) {
                        //核销卡券
                        this.swiper.slideTo(3)
                    }
                })
            },
            //检查是否有历史卡券
            getOldCoupon(callback){
                let url = "/cocacola/Acmp/AcmpApi/couponRecord/list", params = {}
                params['akk_openid'] = this.openId
                params['skip'] = 0
                params['size'] = 1
                this.$axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(result => {
                    let first_coupon = result.data.data.list[0]
                    if(sessionStorage['jumped_to_card']){
                        first_coupon.today = 0
                    }
                    if(!first_coupon){
                        this.canGetPrize = true
                    }
                    if(first_coupon.today == 1 && first_coupon.id == 1998 && first_coupon.record_status != 'CONSUMED'){
                        this.coupon_code = first_coupon.coupon_code
                        sessionStorage.setItem('jumped_to_card', 1)
                        window.location.href = this.coupon_bag_host + 'webcouponthird_party.html' + "?coupon_code=" + this.coupon_code + "&openid=" + this.openId
                    }else if(first_coupon.today==1 && first_coupon.id == 1997 && first_coupon.record_status != 'CONSUMED'){
                        this.coupon_code = first_coupon.coupon_code
                        //设置直跳转一次
                        sessionStorage.setItem('jumped_to_card',1)
                        window.location.href = this.coupon_bag_host + 'webcouponthird_party.html' + "?coupon_code=" + this.coupon_code + "&openid=" + this.openId
                    }else if(first_coupon.id == 1996 && first_coupon.record_status != 'CONSUMED'){
                        this.coupon_code = first_coupon.coupon_code
                        this.swiperPages = 1
                    }
                    this.canGetPrize = true
                    callback()
                })
            },
            //获取随机数
            getMyRand(){
                return (Math.floor(Math.random() * 6) + 6) * 360
            },
            //获取当天最晚的时间错
            getTimeStr(){
                return Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1))
            },
            test(){
                this.rotateFns(5,()=>{
                    console.log('ok')
                })
            }
        }
    }
</script>

<style scoped lang="less">
    @import "Index";
</style>
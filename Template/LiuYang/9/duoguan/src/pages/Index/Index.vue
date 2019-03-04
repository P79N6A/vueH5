<template>
    <div class="loading" v-if="inLoading">
        <img src="../../assets/loading-bars.svg" />
        <!-- <img src="static/images/loading.gif" alt=""> -->
    </div>
    <div class="main" v-else  @touchmove.prevent>
    <!-- <div class="main" v-else ref="wrapper"> -->
        <img src="static/page1/bj.jpg" alt="" class="page1">
        <img src="static/page1/guize.png" alt="" class="rules" @click="showAlert">
        <alertRules :content="page.rules[rulesId]" v-show="has_show_rules" @rulesStatus="getRulesStatus"></alertRules>
        <img src="static/page1/bt.png" alt="" class="titles">
        <div class="canvas" style="backgroundImage:url('static/page1/bai.png')">
            <img :src="prizeInfo.zi" class="xinxi" alt="">
            <img src="static/page1/hui.png" alt="" class="zhezhao" :class="{'zindex':showCanvas}" ref="canvas">
            <canvas id="canvas" ref="canvasShow" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"></canvas>
            <img src="static/page1/anniu.png" class="button1" v-if="!canGetPrize" @click="startCanvas" alt="">
        </div>
        <showPrize :prize="prizeInfo" v-if="hasShowPrizeResult" @showStatus="getPrizeStatus" @showRulesStatus="showRulesStatus"></showPrize>
        <div class="alert" v-show="alertStatus" @touchmove.prevent>
            <div class="content">
                <div class="title">
                    <img src="static/images/download.png" class="icon" alt="">很遗憾
                </div>
                <div class="mess" v-html="alert.mess"></div>
                <hr style="height:1px;width:100%;border:none;border-top:1px solid #E4E4E4;" />
                <div class="footer" @click="hiddenAlertr">
                    知道了
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    //import BScroll from 'better-scroll'
    import Loading from '../../components/Loading';
    //import { getConfig } from '../../services/getConfig';
    //音乐播放组件
    import myMusic from '../../components/playMusic';
    //规则弹窗
    import alertRules from '../../components/alertRules';
    //抽奖结果弹窗
    import showPrize from '../../components/showPrize';
    export default {
        components: {
            Loading,
            alertRules,
            myMusic,
            showPrize
        },
        data() {
            return {
                // ---------------------共用属性-----------------------
                from: '',
                acmp_host:'http://acmp.aikaka.cc/cocacola/Acmp/AcmpApi/',
                coupon_bag_host:'http://acmp.aikaka.com.cn/cocacola/CouponBagV2/',
                //---------------模板链接数据 end-------------
                config: {},
                loading: false,
                inLoading: true, //加载状态
                iCur: 0, //图片加载的序号
                music: {},
                rulesId: 0,
                canGetPrize:false,  //时候可以抽奖
                hasShowPrizeResult: false, //是否展示抽奖结果
                inDraw: false, //是否处于抽奖状态
                rotationAngle:0,
                hasGetPrize: false, // 当前轮数是否已抽奖
                prizeDrawNumberText: '', //抽奖次数提示语
                prizeDrawNumber: 5, //默认抽奖次数
                prize: -1, //默认奖品
                coupon_code:"", //默认卡券ID
                alertStatus:false,
                prizeInfo: {},
                // ---------------------私有属性-----------------------
                ctx:{},
                alert: {
                    mess: "超出每人每天参与次数 <br /> 欢迎明天继续参与"
                },
                canvasTop: "",
                canvasLeft: "",
                prev: "",
                zIndex: "100",
                limit: 20,
                showCanvas: false
            }
        },
        computed: {
            ...mapState({
                image_arr: state => state.images,
                page: state => state.pages[0],
                store_code: state => state.store_code,
                activity_id: state => state.activity_id,
                openid: state => state.openid,
                all_prize: state => state.new_image,
                wxsdk_url: state => state.wxsdk_url,
                has_show_rules: state=> state.has_show_rules
            })
        },
        beforeCreate: function () {
        },
        created() {
            let ajax_url = window.location.href.split('#')[0];
            let url = this.wxsdk_url, _self = this
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
                        console.log(res)
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
        updated(){
        },
        methods: {
            ...mapActions([
                'changeOpenid',
                'changeActivityId',
                'changeCouponCode',
                'changeShowRules'
            ]),
            checkedRouter() {
                // 获取链接参数
                let openid = this.$route.query.openid ? this.$route.query.openid : this.urlGet()['openid'] ? this.urlGet()['openid'].replace(/#\//, "") : ""
                this.changeOpenid(openid)
                let activity_id = this.$route.query.activity_id ? this.$route.query.activity_id: this.activity_id
                this.changeActivityId(activity_id)
                this.from = this.$route.query.from ? this.$route.query.from: this.from
                //console.log(this.openId)
                //链接是否带有 xjjOpenId ？ 直接进入start ： 授权
                if (this.openid !== "" && typeof this.openid !== 'undefined' && this.openid !== null) {
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
            authorize(){
                let url = window.location.href.split('?')[0]
                let host = url + '?activity_id=' + this.activity_id + '&store_code='+ this.store_code
                window.location.replace("https://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url="+ host)
            },
            start() {
                this.loadImages(()=>{
                    this.inLoading = false
                    this.$nextTick(() => {
                        // let wrapper = this.$refs.wrapper
                        // new BScroll(wrapper,{
                        //     click:true
                        // })
                        this.getOldCoupon(() => {
                            this.drawImage()
                            this.showCanvas = true
                        })
                    })
                })
            },
            loadImages(callback) {
                let _self = this
                let oImg = new Image()
                oImg.src = this.image_arr[this.iCur]
                oImg.onload = function () {
                    _self.iCur++
                    if (_self.iCur < _self.image_arr.length) {
                        _self.loadImages(callback)
                    } else {
                        callback()
                    }
                }
            },
            //点击跳转到提交信息页面
            getPrize(){
                this.$router.replace({ path: '/Table', query: { openid: this.openid, activity_id: this.activity_id, store_code: this.store_code, coupon_code:this.coupon_code  } })
            },
            //默认用canvas画出刮刮卡图层
            drawImage() {
                let canvasImg = this.$refs.canvas
                let width = canvasImg.offsetWidth, height = canvasImg.offsetHeight
                let scratch = this.$refs.canvasShow
                //计算出canvas区域的相对位置
                this.canvasTop = scratch.offsetParent.offsetTop
                this.canvasLeft = scratch.offsetLeft
                //设置canvas的宽高
                scratch.width = width
                scratch.height = height
                this.ctx = scratch.getContext("2d")
                this.ctx.clearRect(0, 0, width, height)
                //canvas绘制遮罩层
                this.ctx.drawImage(canvasImg, 0, 0, width, height)
            },
            //点击开始抽奖
            startCanvas() {
                let url = "/cocacola/Acmp/AcmpApi/prize/lottery", params = {}
                params['openid'] = this.openid
                params['activity_id'] = this.activity_id
                params['store_code'] = this.store_code
                this.$axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(result => {
                    console.log(result)
                    //判断是否中奖
                    if (result.data.return_code != 200) {
                        this.haveTimes = 0
                        //this.$set(this.alert, 'mess', '超出每人每天参与次数 < br /> 欢迎明天继续参与')
                        this.alertStatus = true
                    } else {
                        this.canGetPrize = true
                        let GetSelect = result.data.data.coupon.id //从后台拿数据
                        this.changeCouponCode(result.data.data.coupon_code)
                        this.coupon_code = result.data.data.coupon_code
                        this.prize = GetSelect
                        if (GetSelect == 2019) {
                            this.prizeInfo = this.all_prize.prize_img_box[0]
                        } else {
                            this.prizeInfo = this.all_prize.prize_img_box[1]
                        }
                    }
                })
                //用canvas画出遮罩层，把原遮罩层的元素z-index放到最后面
            },
            //开始刮卡
            touchStart(e) {
                if (!this.canGetPrize) return
                this.inDraw = true
                let x = e.touches[0].clientX - this.canvasLeft, y = e.touches[0].clientY - this.canvasTop
                this.pointArr = []
                this.pointArr.push([x, y])
                this.circleReset()
            },
            touchMove(e) {
                let now = new Date()
                if (this.inDraw) {
                    let duration = now - this.prev
                    if (duration < Math.floor(1000 / this.limit)) return
                    this.prev = now
                    let x = e.touches[0].clientX - this.canvasLeft, y = e.touches[0].clientY - this.canvasTop
                    this.ctx
                    this.pointArr.push([x, y])
                    this.circleReset()
                }
            },
            touchEnd() {
                this.inDraw = false
                let scratch = this.$refs.canvasShow
                let imgData = this.ctx.getImageData(0, 0, scratch.width, scratch.height)
                let sum = 0
                for (let i = 0; i < imgData.data.length; i++) {
                    sum += imgData.data[i]
                }
                if (sum < 25000000) {
                    this.raffle()
                }
            },
            //刮开涂层展示奖项
            raffle() {
                let scratch = this.$refs.canvasShow
                this.ctx.clearRect(0, 0, scratch.width, scratch.height)
                this.hasShowPrizeResult = true
            },
            //刮开图层上的img
            circleReset() {
                this.ctx.save()
                this.ctx.beginPath()
                this.ctx.moveTo(this.pointArr[0][0], this.pointArr[0][1])
                this.ctx.lineCap = "round"
                this.ctx.lineJoin = "round"
                this.ctx.lineWidth = "20"
                this.ctx.globalCompositeOperation = 'destination-out'
                if (this.pointArr.length == 1) {
                    this.ctx.lineTo(this.pointArr[0][0] + 1, this.pointArr[0][1] + 1)
                } else {
                    for (let i = 1; i < this.pointArr.length; i++) {
                        this.ctx.lineTo(this.pointArr[i][0], this.pointArr[i][1])
                        this.ctx.moveTo(this.pointArr[i][0], this.pointArr[i][1])
                    }
                }
                this.ctx.closePath()
                this.ctx.stroke()
                //this.ctx.fill()
                //this.ctx.draw()
            },
            //点击领取奖品
            getPrizeStatus(item) {
                //this.hasShowPrizeResult = item
                //this.canGetPrize = true     //设置开奖按钮可点击
                let GetSelect = this.prize, coupon_bag_host = this.coupon_bag_host
                if (GetSelect == 2019) {
                    //京东购物卡4999元
                    this.getPrize()
                }else{
                    //2020，淘票票8元代金券
                    this.checkedCoupond(()=>{
                        window.location.href = 'https://market.m.taopiaopiao.com/markets/TaoBaoMovie/act-jjdjq?wh_ttid=phone'
                    })
                }
            },
            //隐藏系统弹窗
            hiddenAlertr() {
                this.alertStatus = false
            },
            checkedCoupon(params) {
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
            getOldCoupon(callback) {
                let url = "/cocacola/Acmp/AcmpApi/prize/list", params = {}
                params['openid'] = this.openid
                params['activity_id'] = this.activity_id
                this.$axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(result => {
                    let first_coupon = result.data.data[0]

                    if (!first_coupon) {
                        callback()
                        return;
                    }
                    if (sessionStorage['jumped_to_card']) {
                        first_coupon.today = 0
                    }
                    if (first_coupon.today == 1 && first_coupon.coupon_id == 2019 && first_coupon.consume_status == 0) {
                        this.coupon_code = first_coupon.coupon_code
                        this.changeCouponCode(first_coupon.coupon_code)
                        sessionStorage.setItem('jumped_to_card', 1)
                        this.getPrize()
                    }else if(first_coupon.today == 1 && first_coupon.coupon_id == 2020 && first_coupon.consume_status == 0){
                        this.coupon_code = first_coupon.coupon_code
                        sessionStorage.setItem('jumped_to_card', 1)
                        window.location.href = 'https://market.m.taopiaopiao.com/markets/TaoBaoMovie/act-jjdjq?wh_ttid=phone'
                    }
                    callback()
                })
            },
            //点击弹出活动规则
            showAlert(){
                this.rulesId = 0
                this.changeShowRules(true)
                //this.hasShowRules = true
            },
            getRulesStatus(item){
                console.log(item)
                //this.changeShowRules(item)
                //this.hasShowRules = item
            },
            showRulesStatus(item){
                this.rulesId = 1
                this.changeShowRules(true)
                //this.hasShowRules = true
            },
            checkedCoupond(callback) {
                //快速核销掉
                let params = {}
                params['coupon_code'] = this.coupon_code
                let url = "/cocacola/Acmp/AcmpApi/consume/scrape"
                this.$axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(result => {
                    if (result.data.return_code == 200) {
                        //核销卡券
                        callback()
                    }
                })
            },
        }
    }
</script>

<style scoped lang="less">
    @import "Index";
</style>
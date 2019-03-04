<template>
    <div class="main">
        <div ref="page" class="page" :style="{backgroundImage:'url('+ this.page.bg_image +')'}">
            <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
            <img src="static/page1/logo.png" alt="" class="title">
            <div id='myAlert' ref="myAlert">
            
                <div class="alertContent">
                    <img src="static/page2/x.png" class="x" @click="hideAlert">
                    <!-- <div class="title">互动活动条款</div> -->
                    <div class="show showhidden" @scroll="myscroll" ref="show1">
                        <!-- <img :src="content.content" alt="" class="item"> -->
                        <p style="text-align:center;">互动活动条款</p>
                        <p>参与方式: </p>
                        <p>每人共有3次抽奖机会</p>
                        <p></p>
                        <p>活动时间: </p>
                        <p>10月26日9时至11月15日23时</p>
                        <p></p>
                        <!-- <p><input type="text"></p> -->
                        <p>奖品详情:</p>
                        <p>特等奖：UFC北京站门票／UFC定制搏击手套1副</p>
                        <p>一等奖：UFC北京站门票／魔爪及UFC联名平沿帽</p>
                        <p>二等奖：Monster Energy&nbsp;限量赠饮1罐</p>
                        <p></p>
                        <p>兑奖方式:</p>
                        <p>所有中奖者产生后，Monster
                            Energy&nbsp;将安排在&nbsp;7&nbsp;个工作日内，通过中奖人提供的邮箱或电话联系，核实信息。中奖者需提供真实姓名，手机号或其他电话号码及接收快递的地址和邮编。经核实无误后，30&nbsp;个工作日内，奖品会使用特快专递给中奖者。</p>
                        <p></p>
                        <p>声讯电话:</p>
                        <p>010-61190200</p>
                        <p></p>
                        <p>免责声明:</p>
                        <p>如本次活动因不可抗力等原因无法执行时，Monster
                            Energy&nbsp;有权予以暂停、终止或修改活动内容。所有参加者提供的个人信息（包括姓名、手机号或其他电话号码、地址、电邮等）仅用于与进行本次抽奖活动。如对本次抽奖活动有任何疑问，请咨询店内工作人员。</p>
                    </div>
                    <div class="show left" ref="show2" @touchmove.prevent>
                        <!-- <img :src="content.content" alt="" class="item"> -->
                        <p style="text-align:center;">互动活动条款</p>
                        <p>参与方式: </p>
                        <p>每人共有3次抽奖机会</p>
                        <p></p>
                        <p>活动时间: </p>
                        <p>10月26日9时至11月15日23时</p>
                        <p></p>
                        <!-- <p><input type="text"></p> -->
                        <p>奖品详情:</p>
                        <p>特等奖：UFC北京站门票／UFC定制搏击手套1副</p>
                        <p>一等奖：UFC北京站门票／魔爪及UFC联名平沿帽</p>
                        <p>二等奖：Monster Energy限量赠饮1罐</p>
                        <p></p>
                        <p>兑奖方式:</p>
                        <p>所有中奖者产生后，　　Monster
                            Energy　　将安排在　　7个　　工作日内，通过中奖人提供的邮箱或电话联系，核实信息。中奖者需提供真实姓名，手机号或其他电话号码及接收快递的地址和邮编。经核实无误后，　　30　　个工作日内，奖品会使用特快专递给中奖者。</p>
                        <p></p>
                        <p>免责声明:</p>
                        <p>如本次活动因不可抗力等原因无法执行时，Monster
                            Energy有权予以暂停、终止或修改活动内容。所有参加者提供的个人信息（包括姓名、手机号或其他电话号码、地址、电邮等）仅用于与进行本次抽奖活动。如对本次抽奖活动有任何疑问，请咨询店内工作人员。</p>
                    </div>
                    <!-- <img :src="content.button" class="x" @click="hideAlert"> -->
                </div>
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
                prizeImg:{},
                has_show_rules:true
            }
        },
        computed: {
            ...mapState({
                imageArr: state => state.images,
                page: state => state.pages[1],
                activityId: state => state.activityId,
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
                window.location.href = "https://ab.aikaka.com.cn/PublicService/Weixin/oauth/option?callback_url=" + host
            },
            start() { 
                this.allPrize = this.page.prize_img_box
                this.$nextTick(() => {
                })
            },
            //点击跳转到抽奖页面
            getPrize() {
                this.$router.replace({ path: '/Draw', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } })
            },
            //点击叉号返回主界面
            hideAlert(){
                this.$router.replace({ path: '/', query: { openid: this.openId, activity_id: this.activityId, store_code: this.storeCode } })
            },
            myscroll() {
                this.$refs.show2.scrollTop = this.$refs.show1.scrollTop
            }
        }
    }
</script>

<style scoped lang="less">
    @import "Index";
</style>
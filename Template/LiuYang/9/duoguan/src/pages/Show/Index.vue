<template>
    <div class="main">
        <div class="page" :style="{backgroundImage:'url('+ this.page.bg_image +')'}">
            <!-- <myMusic class="my-music" :my-music="music"></myMusic> -->
            <div class="yanhua1 animate-wrapper">
                <img src="static/page3/yanhua1.png" alt="" class="image">
            </div>
            <div class="yanhua2 animate-wrapper">
                <img src="static/page3/yanhua2.png" alt="" class="image">
            </div>
            <div class="yanhua3 animate-wrapper">
                <img src="static/page3/yanhua3.png" alt="" class="image">
            </div>
            <div class="yanhua4 animate-wrapper">
                <img src="static/page3/yanhua4.png" alt="" class="image">
            </div>
            <div class="yanhua5 animate-wrapper">
                <img src="static/page3/yanhua5.png" alt="" class="image">
            </div>
            <div class="yanhua6 animate-wrapper">
                <img src="static/page3/yanhua6.png" alt="" class="image">
            </div>
            <div class="yanhua7 animate-wrapper">
                <img src="static/page3/yanhua7.png" alt="" class="image">
            </div>
            <div class="yanhua8 animate-wrapper">
                <img src="static/page3/yanhua8.png" alt="" class="image">
            </div>

            <div class="title animate-wrapper1">
                <img src="static/page1/bt.png" alt="" class="image">
            </div>
            <div class="rules animate-wrapper2">
                <img src="static/page3/zi.png" alt="" class="image">
            </div>

        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    //import animate from 'animate.css'
    //音乐播放组件
    import myMusic from '../../components/playMusic';
    //规则弹窗
    import alertRules from '../../components/alertRules';
    //提交用户信息
    import myTable from '../../components/myTable';
    export default {
        components: {
            myTable,
            myMusic
        },
        data() {
            return {
                //---------------模板链接数据 end-------------
                config: {},
                music: {},
                rulesId: 0,
                prizeInfo: {},
            }
        },
        computed: {
            ...mapState({
                page: state => state.pages[2],
                store_code: state => state.store_code,
                activity_id: state => state.activity_id,
                openid: state => state.openid,
                coupon_code: state => state.coupon_code,
                wxsdk_url: state => state.wxsdk_url
            })
        },
        beforeCreate: function () {
            document.getElementsByTagName("body")[0].style.height = document.body.clientHeight
            document.getElementsByTagName("html")[0].style.height = document.body.clientHeight
        },
        created() {
            let ajax_url = window.location.href.split('#')[0];
            let url = this.wxsdk_url, _self = this
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
            ...mapActions([
                'changeOpenid',
                'changeActivityId',
                'changeCouponCode'
            ]),
            checkedRouter() {
                if (!this.openid) {
                    // 获取链接参数
                    let openid = this.$route.query.openid ? this.$route.query.openid : this.urlGet()['openid'] ? this.urlGet()['openid'].replace(/#\//, "") : ""
                    this.changeOpenid(openid)
                }
            },
            //缺少必要信息，跳回主页去授权
            getPrize() {
                this.$router.replace({ path: '/' });
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
            //核销成功跳转界面
            getPrize() {
                this.$router.replace({ path: '/Show' });
            }
        }
    }
</script>

<style scoped lang="less">
    @import "Index";
</style>
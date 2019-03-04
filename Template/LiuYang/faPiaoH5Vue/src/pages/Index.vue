<template>
    <section id="template" v-if="hasQrCode">
        <div class="msg">{{msg}}</div>
        <img :src="qrCode" style="width: 300px;height: 300px;margin-top: 200px;">
    </section>
    <section v-else id="template">
        <div class="header">
            <img src="static/img/title.png" alt="" class="title">
            
            <div class="login" v-if="login">
                <img :src="userInfo.headimgurl" alt="" class="headimg">
                <div class="name">{{userInfo.nickname}}</div>
            </div>
            <div class="login" v-else @click="loginIn">点击登录</div>
        </div>
        <Temp :pageInfo = "page1" :verification = "verification"></Temp>

        <div class="content">
            <div class="item" @click="cVerification">
                <img v-if="verification" src="static/img/2.png" alt="" class="check">
                <img v-else src="static/img/1.png" alt="" class="check">
                <div class="lable">验真</div>
            </div>
        </div>

        <div class="show" v-html="showValue"></div>
        <Page :pageInfo = "page2" :identity = "identity" :location="location" @child-say="getValue"></Page>
        <Checkbox :identity = "identity" :location="location" @identityInfo = "cIdentity" @locationInfo = "cLocation" ></Checkbox>
        <List :discern="discern"></List>
    </section>
    
</template>

<script>
    import {getConfig} from '../service/ajax'
    import Temp from '../components/template/Template'
    import Page from '../components/page/Page'
    import Checkbox from '../components/page/Checkbox'
    import List from '../components/list/List'
    export default {
        name: 'Index',
        data() {
            return {
                my_host:"..",
                login: false,
                screenWidth: document.body.clientWidth,
                userInfo:{
                    "nickname":"whatever",
                    "headimgurl":"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL6dYhxxccWiahibT2DEnkFOtmaNG99icELDH3XGQ9px09YicuPflicgPpYdAoHIutjOjCJy2dAzPiapO1g/0"
                },
                page1:{},       //原发票的信息
                page2:{},       //第二个发票的信息
                discern:{},     //百度识别结果
                invoices:{},
                checkInvoices:{},
                hasQrCode:false,
                qrCode:"",
                qrKey:"",
                identity: true,
                location: true,
                showValue:"",
                msg:"",
                verification:false,     //点击验真
                showColor:[
                    [0, 0.75, "#e21d1d"],
                    [0.75, 0.9, "#ff8244"],
                    [0.9, 0.95, "#666666"],
                    [0.95, 0.98, "#2882b0"],
                    [0.98, 1, "#2a4bb8"],
                ]
            }
        },
        components:{ Temp, Page, Checkbox, List},
        created(){
            let this_url = window.location.href
            //let vConsole = new VConsole()
            if (this_url.substr(0, 14) == "http://invoice") {
                this.my_host = "/IRSP"
            } else if (this_url.substr(0, 21) == "http://acmp.aikaka.co") {
                this.my_host = "/IRSP"
            } else {
                this.my_host = ".."
            }
        },
        mounted(){
            const that = this
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth
                    that.screenWidth = window.screenWidth
                })()
            }
        },
        watch:{
            screenWidth(val) {
                this.screenWidth = val
                this.setInvoice(this.invoices)
            },
            invoices(val){
                this.setInvoice(this.invoices)
            }
        },
        methods:{
            //点击登录注册
            loginIn(){
                if(this.login) return
                let url = this.my_host+"/user/loginQr", params = {}
                this.$axios({
                    method:'post',
                    url:url,
                    data:params
                }).then(result => {
                    let res = result.data
                    if(res.return_code == 200){
                        this.hasQrCode = true
                        let urls = res.data.url
                        this.qrCode = urls
                        this.qrKey = res.data.qr_key
                        //轮询向后台发起请求看看用户是否登陆
                        this.checkLoing()
                    }
                })
            },
            checkLoing(){
                let code = this.qrKey, params = {}
                params['qr_key'] = code
                this.loginInterval = setInterval(()=>{
                    this.$axios({
                        method: 'post',
                        url: this.my_host + "/user/loginResult",
                        data: params
                    }).then(result=>{
                        console.log(result)
                        let res = result.data.data
                        if(res.status == 'LOGIN'){
                            clearInterval(this.loginInterval)
                            this.userInfo = res
                            if(this.userInfo.group_id == 0){
                                this.msg = "没有访问权限"
                            }else{
                                this.login = true
                                this.hasQrCode = false
                                this.getMyInvoice()
                                //获取用户的发票信息
                                setInterval(() => {
                                    this.getMyInvoice()
                                }, 2000)
                            }
                        }
                    })
                },1000)
            },
            //配置用户返回的发票信息
            setInvoice(res){
                let page1 = {}, page2 = {}, discern=[], item = {}
                page2.url = res.img_path
                page2.points = []
                res.position.forEach(element => {
                    item = {}
                    item['value']       = element.value
                    item['name']    = element.name
                    item['left_top']    = element.left_top
                    item['right_top']   = element.right_top
                    item['right_bottom']= element.right_bottom
                    item['left_bottom'] = element.left_bottom
                    //判断颜色
                    if(element.probability.average){
                        this.showColor.forEach(colors =>{
                            if(colors[0] <= element.probability.average && element.probability.average < colors[1]){
                                item['color'] = colors[2]
                            }
                        })
                    }else{
                        item['color'] = "red"
                    }
                    page2.points.push(item)

                    item = {}
                    item['value'] = element.value
                    item['property'] = element.property
                    item['name'] = element.name
                    item['probability'] = element.probability.average
                    discern.push(item)
                    if(!this.verification){
                        page1[element.property] = element.value
                    }else{
                        page1[element.property] = element.value_diff
                    }
                    //单独判断发票识别号，来判断是哪里的发票
                    if (element.property == 'invoice_code') {
                        page1['real_invoice_code'] = element.real
                    }
                });
                this.page1 = page1
                this.page2 = page2
                this.discern = discern
            },
            getValue(value){
                this.showValue = value
            },
            cIdentity(val){
                this.identity = val
            },
            cLocation(val){
                this.location = val
            },
            //获取用户的发票信息
            getMyInvoice(){
                let user_id = this.userInfo.id
                this.$axios({
                    method:"get",
                    url: this.my_host + "/invoice/lastInvoice?user_id="+ user_id
                    //url: this.my_host + "/invoice/lastInvoice?user_id=933"
                }).then(res=>{
                    if(res.data.data.img_path != this.invoices.img_path){
                        this.invoices = res.data.data
                    }
                })
            },
            //点击验真
            cVerification() {
                this.verification = !this.verification
                console.log(this.verification)
                if(this.login == true){
                    this.setInvoice(this.invoices)
                }
                
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    @import 'Index';
</style>
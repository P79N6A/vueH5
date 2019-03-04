<template>
    <div class="loading" v-if="inLoading">
        <img src="../../assets/loading-bars.svg">
    </div>
    <swiper class="main" v-else :options="swiperOption" ref="mySwiper">
        <!-- <swiper-slide v-for="item in pages" class="page" :style="{backgroundImage:'url('+ item.bg_image +')'}">
            2
        </swiper-slide> -->
        <swiper-slide class="page" :style="{backgroundImage:'url('+ this.config.image.bg_image +')'}">
            <myMusic class="my-music" :my-music="music"></myMusic>
            <div class="turnplat">
                <!--抽奖圆盘-->
                <canvas id="prizeDisc" ref="prizeDisc" :style="{transform:'rotate('+this.rotationAngle+'deg)'}"></canvas>
                <img src="/static/images/zhizhen.png" :style="{top:-14*this.fontSize+'px'}" id="zhizhen" ref="zhizhen" @click="test">
            </div>
        </swiper-slide>

        <swiper-slide class="page" :style="{backgroundImage:'url('+ this.config.image.bg_image +')'}">
            2
        </swiper-slide>
        <swiper-slide class="page" :style="{backgroundImage:'url('+ this.config.image.bg_image +')'}">
            3
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
    //大转盘组件
    import Turnplate from '../../components/Turnplate';
    export default {
        components: {
            Loading,
            Turnplate,
            myMusic
        },
        data() {
            return {
                // ---------------------共用属性-----------------------
                xjjOpenId: '',
                openId: '',
                activityId: '',
                from: '',
                storeCode: '',
                //---------------模板链接数据 end-------------
                config: {},
                loading: false,
                inLoading: true, //加载状态
                images: {}, //图片集--用作图片展示
                imageArr: [],//图片集--用作判断图片加载状态
                iCur: 0, //图片加载的序号
                music: {},
                hasShowSilkBag: false, //是否展示锦囊
                hasShowPrizeResult: false, //是否展示抽奖结果
                inDraw: false, //是否处于抽奖状态
                rotationAngle:0,
                hasGetPrize: false, // 当前轮数是否已抽奖
                prizeDrawNumberText: '', //抽奖次数提示语
                prizeDrawNumber: 5, //默认抽奖次数
                prize: -1, //默认奖品
                prizeInfo: {},
                // ---------------------私有属性-----------------------
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
                // trunplatConfig: {
                //     outsideRadius:20, //把画canvas的区域分成20个同心圆，以下三个属性填写其所占的同心圆的个数
                //     insideRadius:7,
                //     textRadius:15,
                //     zpBgImg:"https://download.aikaka.com.cn/003a3d58989af3a0f07370648e9b4ea6?f=png",
                //     color: ["#283B8A", "#17EDF8", "#17F83A", "#F1F817", "#F89617", "#F81717"],
                //     fontColor:["ffffff", "ffffff", "ffffff", "ffffff", "ffffff", "ffffff"],
                //     prizes:["一等奖", "二等奖", "三等奖||6666", "四等奖||ignore", "五等奖||逗你玩", "六等奖"]
                // }
                trunplatConfig:{}
            }
            
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper
            }
        },
        created() {
            this.start()
            console.log(this.fontSize)
        },
        watch: {
            // '$route': 'checkedRouter'
        },
        mounted() {
            
            //console.log('this is current swiper instance object', this.swiper)
            //this.swiper.slideTo(3, 1000, false)
        },
        updated(){
        },
        methods: {
            start() {
                getConfig(res => {
                    this.config = res
                    this.music = this.config.music
                    this.imageArr = this.config.images
                    this.pages = this.config.pages
                    this.trunplatConfig = this.config.trunplatConfig
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
                    console.log(this.swiper)
                    this.createdCtx()
                })
            },
            //画转盘
            createdCtx(){
                let prizeDisc = this.$refs.prizeDisc
                let canvasW = 20 * this.fontSize,
                canvasH = 20 * this.fontSize,
                turnplate = this.trunplatConfig
                let arc = Math.PI / (turnplate.color.length / 2)
                prizeDisc.setAttribute("width", canvasW)
                prizeDisc.setAttribute("height", canvasH)
                if(prizeDisc){
                    let ctx = prizeDisc.getContext("2d")
                    ctx.clearRect(0, 0, canvasW, canvasH)
                    let newImg = new Image()
                    newImg.src = turnplate.zpBgImg
                    ctx.drawImage(newImg, 0, 0, canvasW, canvasH)
                    
                    ctx.strokeStyle = "#000000"
                    let line_height = 24, angle, prizesNum = turnplate.color.length, texts = turnplate.prizes
                    let textRedis = parseInt((canvasW - 2) * turnplate.textRadius / 40)
                    for(let i=0; i< prizesNum; i++){
                        angle = 2*Math.PI*(i/prizesNum)
                        ctx.beginPath()
                        ctx.fillStyle=turnplate.color[i]
                        ctx.arc(canvasW / 2, canvasH / 2, (canvasW - 2*this.fontSize)*turnplate.outsideRadius/40, angle, arc + angle, false)
                        ctx.arc(canvasW / 2, canvasH / 2, (canvasW - 2*this.fontSize)*turnplate.insideRadius/40, arc + angle, angle, true)
                        ctx.fill()
                        ctx.stroke()
                        
                        ctx.save()
                        //绘制文字
                        ctx.fillStyle = "#ffffff"
                        ctx.font = 'bold 10pt Microsoft YaHei'
                        ctx.translate(parseInt(canvasW / 2) + parseInt(textRedis* Math.cos(angle + arc / 2)), parseInt(canvasH/2) + parseInt(textRedis * Math.sin(angle + arc / 2)))
                        ctx.rotate(angle + arc / 2 + Math.PI / 2)
                        let textArr = texts[i].split("||")
                        for(let j=0; j < textArr.length; j++){
                            ctx.fillText(textArr[j], -ctx.measureText(textArr[j]).width/2, j*line_height)
                        }
                        ctx.restore()
                    }

                    
                }
            },
            //旋转设定中奖item
            rotateFn(item, finishFun){
                if(!this.inDraw){
                    this.inDraw = !this.inDraw
                    let angle = item*(360/this.trunplatConfig.color.length) - 360*2/this.trunplatConfig.color.length, stopAngle = angle, myAngle = 0, speed=0
                    let times = 20,   //频率
                    addTime = 2,    //加速时间
                    aPlus = 0,       //加速时间内的加速度
                    xLimit = 1800,      //加到最大速度的角度
                    endTime = 0,        //减速所用的时间
                    aMinus = 0          //减速时的加速度

                    let iTime = addTime*1000/times

                    angle += this.getMyRand()
                    aPlus   = parseFloat(2*(angle-xLimit)/(iTime*iTime))
                    endTime = parseFloat(2*xLimit/(iTime*aPlus))
                    aMinus  = parseFloat(aPlus*iTime/endTime)

                    this.setRotate = setInterval(()=>{
                        if(angle>=xLimit){
                            // myAngle += parseFloat(aPlus * (1000/times))
                            // angle -= parseFloat(aPlus * (1000 / times))
                            speed += parseFloat(aPlus*100)/100
                            myAngle += (speed + speed*iTime)/2
                            angle -= (speed + speed * iTime) / 2
                        }else if(angle >=0){
                            if(speed >= parseFloat(aMinus*100)/500){
                                speed -= parseFloat(aMinus * 100) / 100
                            }else{
                                speed = parseFloat(aMinus * 500) / 100
                            }
                            myAngle += (speed + speed * iTime) / 2
                            angle -= (speed + speed * iTime) / 2
                            // myAngle += parseFloat(speed-(1000 / times) *aMinus)
                            // angle -= parseFloat(speed - (1000 / times) * aMinus)
                        }else{
                            myAngle = stopAngle
                            clearInterval(this.setRotate)
                            this.inDraw = !this.inDraw
                            finishFun()
                        }
                        this.rotationAngle = myAngle
                    }, 1000/times)
                }
                
            },
            rotateFns(item, finishFun) {
                if (!this.inDraw) {
                    this.inDraw = !this.inDraw
                    let angle = item * (360 / this.trunplatConfig.color.length) - 360 * 2 / this.trunplatConfig.color.length, allTime = 8000, times = 20
                    angle += this.getMyRand()
                    let a1 = (angle/((allTime*times/2000)*(allTime*times/2000))).toFixed(4)
                    let myAngle = 0, count1 = 0, count2 = 0

                    this.setRotate = setInterval(() => {
                        if (myAngle <= angle/2) {
                            count1++
                            myAngle = a1*count1*count1/2
                        } else if (myAngle < angle) {
                            count2++
                            myAngle = myAngle+a1*count1*count2-a1*count2*count2/2
                        } else {
                            myAngle = angle
                            clearInterval(this.setRotate)
                            this.inDraw = !this.inDraw
                            finishFun()
                        }
                        console.log(angle)
                        console.log(myAngle)
                        this.rotationAngle = myAngle
                    }, 1000 / times)
                }

            },
            //获取随机数
            getMyRand(){
                return (Math.floor(Math.random() * 6) + 6) * 360
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
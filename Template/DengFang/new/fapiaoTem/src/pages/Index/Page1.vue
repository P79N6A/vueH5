<template>
    <div class="loading" v-if="inLoading">
        <img src="../../assets/loading-bars.svg">
    </div>
    <div v-else class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">Slide 1</div>
            <div class="swiper-slide">Slide 2</div>
            <div class="swiper-slide">Slide 3</div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>

    </div>
</template>

<script>
    import Swiper from 'swiper';
    import Loading from '../../components/Loading';
    //图片预加载
    import { getConfig } from '../../services/getConfig';
    //大转盘组件
    import Turnplate from '../../components/Turnplate';
    export default {
        components: {
            Loading,
            Turnplate
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
                music: '', //音乐地址
                inPlay: false, //是否在播放音乐
                hasShowSilkBag: false, //是否展示锦囊
                hasShowPrizeResult: false, //是否展示抽奖结果
                inDraw: false, //是否处于抽奖状态
                hasGetPrize: false, // 当前轮数是否已抽奖
                prizeDrawNumberText: '', //抽奖次数提示语
                prizeDrawNumber: 5, //默认抽奖次数
                prize: -1, //默认奖品
                prizeInfo: {},
                // ---------------------私有属性-----------------------
                showArr: [210, 270, 330, 390, 450, 510], //奖盘排列序号,
                imagesArr: [],//画布需要的奖品icon对象，用于预加载图片
                fontSize: 0 //当前屏幕下字体大小
            }
        },
        created() {
            this.start()

        },
        watch: {
            '$route': 'checkedRouter'
        },
        mounted() {

        },
        methods: {
            start() {
                getConfig(res => {
                    this.config = res
                    this.music = this.config.music
                    this.imageArr = this.config.images

                    //图片预加载
                    this.loadImages(() => {
                        this.inLoading = false;
                        console.log('ok')
                        setTimeout(() => {
                            this.swiper = new Swiper('.swiper-container', {
                                autoplay: true,
                                loop: true,
                                // 如果需要分页器
                                pagination: '.swiper-pagination',
                                // 如果需要前进后退按钮
                                nextButton: '.swiper-button-next',
                                prevButton: '.swiper-button-prev',
                                // 如果需要滚动条
                                scrollbar: '.swiper-scrollbar',
                            })
                        }, 1000);

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
            }
        }
    }
</script>

<style scoped lang="less">
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        background: #fff;
        width: 100%;
        height: 100%;
        img {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -2.5rem;
            margin-top: -2.5rem;
            width: 5rem;
            height: 5rem;
        }
    }
</style>
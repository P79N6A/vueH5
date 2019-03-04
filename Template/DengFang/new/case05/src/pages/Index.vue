<template>
  <section id="template">
    <div class="loading" v-if="inLoading">
      <img src="../assets/loading-bars.svg">
    </div>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <!--音乐播放/暂停按钮-->
          <div class="music-image" :class='inPlay?"music-active":""'
               :style='{backgroundImage:"url("+images.music_image+")"}'
               @click="playMusic"></div>
          <!--音乐播放器-->
          <audio loop="loop" id="audio" :src="music"></audio>
          <!--海报-->
          <div class="poster-parent">
            <canvas id="poster"></canvas>
            <!--按钮-->
            <div class="poster-button"
                 :style="{backgroundImage:'url('+images.poster_button+')', zIndex:posterImages.length +1}"
                 @touchstart="touchStart" @touchend="touchEnd"></div>
            <div class="dialog-arrow" v-if="showArrow" @click="toActivity"></div>
          </div>
        </div>
        <div class="swiper-slide">
          <Activity :activityInfo="activityInfo" v-on:child-say="activityBack"></Activity>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  //引入活动组件
  import Activity from "../components/Activity.vue";
  import {authorize} from '../services/authorize';
  //引入json文件
  import{getConfig} from '../services/getConfig';
  export default {
    //注册引入的组件
    components: {
      Activity
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
        inLoading: true, //加载状态
        images: {}, //图片集--用作图片展示
        imageArr: [],//图片集--用作判断图片加载状态
        iCur: 0, //图片加载的序号
        music: '', //音乐地址
        inPlay: false, //是否在播放音乐
        // ---------------------私有属性-----------------------
        swiper: {},
        activityInfo: {},
        fontSize: 0, //当前屏幕下字体大小
        posterImages: [], // 海报图片组
        showPosterIndex: 0, //当前展示的海报下标
        changeScaleTimer: 0,
        posterOverSize: 0,
        posterMiniSize: 0,
        ctx: {},
        radio: 1,
        fps: 100,
        scale: .99,
        timer: 0,
        showArrow: false
      }
    },
    created(){      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      document.querySelector("body").addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      if (document.querySelector(".poster-button")) {
        document.querySelector(".poster-button").addEventListener("contextmenu", function (e) {
          e.preventDefault();
        });
      }
      // 获取当前屏幕下默认的html字体大小
      this.fontSize = parseFloat(window.getComputedStyle(document.querySelector("html")).fontSize);
      this.checkedRouter();
    },
    watch: {
      '$route': 'checkedRouter'
    },
    mounted(){
      //实例化 Swiper
      this.swiper = new Swiper('.swiper-container', {
        direction: 'vertical', //type
        speed: 800, //切换速度
        resistanceRatio: 0,  //抵抗率。边缘抵抗力的大小比例，0时完全无法拖离
      });
    },
    methods: {
      checkedRouter(){
        // 获取链接参数
        this.xjjOpenId = this.$route.query.xjj_openId;
        this.openId = this.$route.query.openid;
        this.activityId = this.$route.query.activity_id;
        this.from = this.$route.query.from;
        this.storeCode = this.$route.query.store_code;
        // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
        if (this.xjjOpenId !== "" && typeof this.xjjOpenId !== 'undefined' && this.xjjOpenId !== null) {
          this.start();
        } else {
          authorize(this.openId, this.activityId, this.from, this.storeCode);
        }
      },
      start(){ // 模板执行入口方法
        getConfig(res => {
          this.config = res;
          this.music = this.config.music;
          // 组合模板图片地址进行预加载
          for (let item in  this.config.images) {
            if (item === 'prize_img_box') {
              for (let prize of this.config.images[item]) {
                this.imageArr.push({
                  id: prize.item_id,
                  key: 'prize_img',
                  val: prize.prize_img
                });
              }
            } else if (item === 'poster_img_box') {
              for (let poster of this.config.images[item]) {
                this.imageArr.push({
                  key: 'poster',
                  imgW: poster.imgW, //图片的宽度
                  imgH: poster.imgH, // 图片的高度
                  areaW: poster.areaW, // 上一张图片在当前图片显示区域的宽度
                  areaH: poster.areaH, // 上一张图片在当前图片显示区域的高度
                  areaL: poster.areaL, // 上一张图片在当前图片显示区域的x
                  areaT: poster.areaT,// 上一张图片在当前图片显示区域的y
                  val: poster.link,// 图片的链接
                  img: ''
                });
              }
            } else {
              this.imageArr.push({
                id: null,
                key: -1,
                val: this.config.images[item]
              });
            }
          }
          // 图片加载完成后进行赋值处理
          this.loadImages((back) => {
            this.images = this.config.images;
            this.activityInfo = {
              silk_bag_image: this.images.silk_bag_image,
              prize_img_box: this.images.prize_img_box,
              activity_bg: this.images.activity_bg,
              host: this.config.host,
              ids: {
                xjjOpenId: this.xjjOpenId,
                openId: this.openId,
                activityId: this.activityId,
                from: this.from,
                storeCode: this.storeCode
              }
            };
            this.inLoading = false;
            this.createdCanvas();
          });
        });
      },

      loadImages(callback){        // 加载图片
        const self = this;
        const item = this.imageArr[this.iCur];
        let oImage = new Image();
        oImage.src = item.val;
        oImage.onload = function () {
          if (item.key === 'poster') {
            item.img = oImage;
            self.posterImages.push(item);
          }
          self.iCur++;
          if (self.iCur < self.imageArr.length) {
            self.loadImages(callback);
          } else {
            callback(1);
          }
        };
      },
      createdCanvas(){ //绘制画布并设置其大小
        const canvas = document.getElementById('poster');
        if (canvas) {
          canvas.setAttribute("width", 750);
          canvas.setAttribute("height", 1206);
          this.ctx = canvas.getContext("2d");
          this.draw();
        }
      },
      draw(){
        // 绘制canvas 图片
        if (this.radio < this.posterImages[this.showPosterIndex + 1].areaW / this.posterImages[this.showPosterIndex + 1].imgW) {
          this.showPosterIndex++;
          this.radio = 1;
        } else {
          const imgNext = this.posterImages[this.showPosterIndex + 1];
          const imgCur = this.posterImages[this.showPosterIndex];
          this.img_oversize = this.posterImages[this.showPosterIndex + 1].img;
          this.img_minisize = this.posterImages[this.showPosterIndex].img;
          //绘制
          this.drawImgOversize(this.img_oversize, imgNext.imgW, imgNext.imgH, imgNext.areaW,
            imgNext.areaH, imgNext.areaL, imgNext.areaT, this.radio);
          this.drawImgMinisize(this.img_minisize, imgCur.imgW, imgCur.imgH, imgNext.imgW,
            imgNext.imgH, imgNext.areaW, imgNext.areaH, imgNext.areaL, imgNext.areaT, this.radio)
        }
      },

      drawImgOversize(i, e, t, a, n, m, s, g){
        //图片地址，起始位置X,Y,图片所要绘制的区域的W,H,图片在canvas中定位的x,y,图片在canvas中即将绘制的区域的W,H
        this.ctx.drawImage(i, m - (a / g - a) * (m / (e - a)), s - (n / g - n) * (s / (t - n)), a / g, n / g, 0, 0, 750, 1206);
      },
      drawImgMinisize(i, e, t, a, n, m, s, g, r, o){
        //图片地址，起始位置X,Y,图片所要绘制的区域的W,H,图片在canvas中定位的x,y,图片在canvas中即将绘制的区域的W,H
        this.ctx.drawImage(i, 0, 0, e, t, (m / o - m) * (g / (a - m)) * o * 750 / m,
          (s / o - s) * (r / (n - s)) * o * 1206 / s, 750 * o, 1206 * o)
      },
      touchStart(ev){
        const self = this;
        let t;
        ev.preventDefault();
        $('.swiper-slide').addClass('swiper-no-swiping');
        function e() {
          const a = (new Date).getTime();
          if (self.showPosterIndex + 1 != self.posterImages.length) {
            if (a - t < 1e3 / self.fps) {
              self.timer = requestAnimationFrame(e)
            } else {
              t = a;
              self.radio = self.scale * self.radio;
              self.draw();
              self.timer = requestAnimationFrame(e);
            }
          } else {
            $('.poster-button').hide();
            self.showArrow = true;
            setTimeout(function () {
              self.touchEnd();
              self.swiper.slideTo(2, 800, false)
            }, 800);
          }
        }

        cancelAnimationFrame(this.timer);
        t = (new Date).getTime();
        this.timer = requestAnimationFrame(e)
      },
      touchEnd(){
        $('.swiper-slide').removeClass('swiper-no-swiping');
        cancelAnimationFrame(this.timer)
      },

      playMusic(){        //播放暂停音乐
        this.inPlay = !this.inPlay;
        const music = document.getElementById('audio');
        if (this.inPlay) {
          music.play();
        } else {
          music.pause();
        }
      },
      toActivity(){
        this.swiper.slideTo(2, 800, false)
      },
      activityBack(back){  //活动页面的回调
        if (back) {
          $('.swiper-slide').addClass('swiper-no-swiping');
        } else {
          $('.swiper-slide').removeClass('swiper-no-swiping');
        }
      },
    }
  };
</script>
<style scoped lang='less'>
  @import 'index';
</style>

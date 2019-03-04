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
            <div class="poster-child" v-for="poster,index of posterImages" :key="poster.name"
                 :style="{backgroundImage:'url('+poster.image+')', zIndex:posterImages.length - index}"></div>
            <!--按钮-->
            <div class="poster-button"
                 :style="{backgroundImage:'url('+images.poster_button+')', zIndex:posterImages.length +1}"
                 @touchstart="touchStart" @touchend="touchEnd"></div>
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
  const config = require('../../static/data/config.json');
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
        inLoading: true, //加载状态
        images: {}, //图片集--用作图片展示
        imageArr: [],//图片集--用作判断图片加载状态
        iCur: 0, //图片加载的序号
        music: '', //音乐地址
        inPlay: false, //是否在播放音乐
        // ---------------------私有属性-----------------------
        activityInfo: {},
        fontSize: 0, //当前屏幕下字体大小
        posterImages: [], // 海报图片组
        showPosterIndex: 0, //当前展示的海报下标
        changeScaleTimer: 0,
      }
    },
    created(){      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      this.music = config.music;
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
        authorize(this.activityId, this.openId, this.from, this.storeCode);
      }
    },
    watch: {
      '$route': 'checkedRouter'
    },
    mounted(){
      //实例化 Swiper
      new Swiper('.swiper-container', {
        direction: 'vertical', //type
        speed: 800, //切换速度
        resistanceRatio: 0,  //抵抗率。边缘抵抗力的大小比例，0时完全无法拖离
      });
    },
    methods: {
      checkedRouter(){
        this.xjjOpenId = this.$route.query.xjj_openId;
        // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
        if (this.xjjOpenId !== "" && typeof this.xjjOpenId !== 'undefined' && this.xjjOpenId !== null) {
          this.start();
        } else {
          authorize(this.openId, this.activityId, this.from, this.storeCode);
        }
      },
      start(){ // 模板执行入口方法
        // 组合模板图片地址进行预加载
        for (let item in  config.images) {
          if (item === 'prize_img_box') {
            for (let prize of config.images[item]) {
              this.imageArr.push({
                id: prize.item_id,
                key: 'prize_img',
                val: prize.prize_img
              });
            }
          } else if (item === 'poster_img_box') {
            for (let poster of config.images[item]) {
              this.imageArr.push({
                key: 'poster_img',
                val: poster.poster_img
              });
              this.posterImages.push({
                posterName: poster.poster_name,
                positionX: poster.positionX,
                positionY: poster.positionY,
                image: poster.poster_img
              });
            }
          } else {
            this.imageArr.push({
              id: null,
              key: -1,
              val: config.images[item]
            });
          }
        }
        // 图片加载完成后进行赋值处理
        this.loadImages((back) => {
          this.images = config.images;
          this.activityInfo = {
            silk_bag_image: this.images.silk_bag_image,
            prize_img_box: this.images.prize_img_box,
            activity_bg: this.images.activity_bg,
            host: config.host
          };
          this.inLoading = false;
        });

      },

      loadImages(callback){        // 加载图片
        const self = this;
        let oImage = new Image();
        oImage.src = this.imageArr[this.iCur].val;
        oImage.onload = function () {
          self.iCur++;
          if (self.iCur < self.imageArr.length) {
            self.loadImages(callback);
          } else {
            callback(1);
          }
        };
      },
      touchStart(e){
        e.preventDefault();
        $('.swiper-slide').addClass('swiper-no-swiping');
        //获取当前坐标在相对于iPhone6尺寸大小时的比例
        const X = this.posterImages[this.showPosterIndex].positionX / 40;
        const Y = this.posterImages[this.showPosterIndex].positionY / 40;
        $('.poster-child').eq(this.showPosterIndex).css({
          '-webkit-transform-origin': X + 'rem ' + Y + 'rem',
          'transform-origin': X + 'rem ' + Y + 'rem'
        }).addClass('poster-child-action');
        this.changeScale(e);
      },
      touchEnd(){
        clearInterval(this.changeScaleTimer);
        $('.swiper-slide').removeClass('swiper-no-swiping');
        const style = $('.poster-child').eq(this.showPosterIndex).css('transform').split(',')[3];
        $('.poster-child').eq(this.showPosterIndex).removeClass('poster-child-action').css({
          '-webkit-transform': 'scale(' + style + ')',
          'transform': 'scale(' + style + ')',
          '-webkit-transition': '-webkit-transform 0.01s',
          'transition': 'transform 0.01s',
        });
      },
      changeScale(event){
        const self = this;
        this.changeScaleTimer = setInterval(function () {
          const matrix = $('.poster-child').eq(self.showPosterIndex).css('transform').split(',');
          if (matrix[3] <= 0.01) {
            $('.poster-child').eq(self.showPosterIndex).hide();
            self.showPosterIndex++;
            if (self.showPosterIndex >= self.posterImages.length - 1) {
              $('.poster-button').hide();
            } else {
              self.touchStart(event);
            }
          }
        }, 1);
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
  @import 'index02';
</style>

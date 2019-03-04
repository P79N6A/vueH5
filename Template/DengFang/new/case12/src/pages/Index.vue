<template>
  <section id="template">
    <div class="loading" v-if="inLoading">
      <img src="../assets/loading-bars.svg">
    </div>
    <!--音乐播放/暂停按钮-->
    <div class="music-image" :class='inPlay?"music-active":""' :style='{backgroundImage:"url("+images.music_image+")"}'
         @click="playMusic"></div>
    <!--音乐播放器-->
    <audio loop="loop" id="audio" :src="music"></audio>
    <!--锦囊按钮-->
    <div class="silk-bag-icon" :style='{backgroundImage:"url("+images.silk_bag_image+")"}'
         @click="showSilkBag"></div>
    <!--模板私有内容 -->
    <div class="luck-card">
      <div class="home" :style='{backgroundImage:"url("+images.home_bg_image+")"}'>
        <!--签盒-->
        <div class="bamboo_sticks_box" :style='{backgroundImage:"url("+images.bamboo_sticks_box+")"}'></div>
        <!--竹签-->
        <div class="bamboo_stick" :style='{backgroundImage:"url("+bambooStickBg+")"}'></div>
        <!--剩余抽奖次数 -->
        <div class="prize-draw-number-text" v-html="prizeDrawNumberText"></div>
      </div>
    </div>
    <!--锦囊组件-->
    <SilkBag v-if="hasShowSilkBag" v-on:child-say="hideSilkBag"></SilkBag>
    <!--开奖结果组件-->
    <PrizeResult :prizeInfo="prizeInfo" v-if="hasShowPrizeResult" @tryAgain="tryAgain"></PrizeResult>
    <Loading v-if="loading"></Loading>
  </section>
</template>
<script>
  //引入锦囊组件
  import SilkBag from "../components/SilkBag.vue";
  import Loading from '../components/Loading.vue';
  //引入开奖结果组件
  import PrizeResult from "../components/PrizeResult.vue";
  import {authorize} from '../services/authorize';
  //引入json文件
  import{getConfig} from '../services/getConfig';
  import {getcoupon} from "../services/getcoupon";
  export default {
    //注册引入的组件
    components: {
      SilkBag,
      Loading,
      PrizeResult
    },
    data() {
      return {
        // ---------------------共用属性-----------------------
        xjjOpenId: '',
        openId: '',
        activityId: '',
        defaultFrom: '',
        storeCode: '',
        cardId: '', //卡片ID
        //---------------模板链接数据 end-------------
        config: {},
        loading: false,
        inLoading: true, //加载状态
        inReady: true,
        images: {}, //图片集--用作图片展示
        imageArr: [],//图片集--用作判断图片加载状态
        iCur: 0, //图片加载的序号
        music: '', //音乐地址
        inPlay: false, //是否在播放音乐
        hasShowSilkBag: false, //是否展示锦囊
        inDraw: false,
        hasShowPrizeResult: false, //是否展示抽奖结果
        prizeDrawNumberText: '', //抽奖次数提示语
        prizeDrawNumber: 5,
        prizeInfo: {},
        // ---------------------私有属性-----------------------..
        shakeNum: 0,
        bambooStickBg: '',
        canShake: true
      }
    },
    created(){      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      document.querySelector("body").addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      this.checkedRouter();
    },
    watch: {
      '$route': 'checkedRouter',
    },
    methods: {
      checkedRouter(){
        //获取路由上的参数
        this.cardId = this.getVal('cardId') ? this.getVal('cardId') : this.$route.query.cardId;
        this.openId = this.getVal('openId') ? this.getVal('openId') : this.$route.query.openid;
        this.activityId = this.getVal('activity_id') ? this.getVal('activity_id') : this.$route.query.activity_id;
        this.defaultFrom = this.getVal('defaultFrom') ? this.getVal('defaultFrom') : this.$route.query.defaultFrom;
        this.storeCode = this.getVal('store_code') ? this.getVal('store_code') : this.$route.query.store_code;
        this.xjjOpenId = this.$route.query.xjj_openId;
        // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
        if (this.xjjOpenId !== "" && typeof this.xjjOpenId !== 'undefined' && this.xjjOpenId !== null) {
          this.start();
        } else {
          authorize(this.activityId, this.openId, this.defaultFrom, this.storeCode, this.cardId);
        }
      },
      getVal(item) {
        const svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return svalue ? svalue[1] : svalue;
      },
      start(){ // 模板执行入口方法
        getConfig(res => {
          this.config = res;
          this.music = this.config.music;
          $('title').html(this.config.title);
          const defaultImage = this.config.images.default_image;
          // 组合模板图片地址进行预加载
          for (let item in  this.config.images) {
            if (item === 'bamboo_sticks') {
              for (let card of  this.config.images[item]) {
                this.imageArr.push({
                  key: 'bamboo-stick',
                  val: card.url
                });
              }
            } else {
              this.imageArr.push({
                key: item,
                val: this.config.images[item]
              });
            }
          }
          // 图片加载完成后进行赋值处理
          this.loadImages((back) => {
            this.images = this.config.images;
            this.setDrawNumber();
            this.shaking();
            this.inLoading = false;
          });
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
      setDrawNumber(){
        //设置次数提示
        const prizeDrawNumberText = this.config.tooltips.prize_draw_number;
        this.prizeDrawNumberText = prizeDrawNumberText.replace("{n}",
          '<span style="color: goldenrod"> ' + this.prizeDrawNumber + ' </span>');
      },

      shaking(){
        const self = this;
        const SHAKE_THRESHOLD = 2000;
        let last_update = 0;
        let x = 0, y = 0, z = 0, last_x = 0, last_y = 0, last_z = 0;
        let timer = 0;
        if (window.DeviceMotionEvent) {
          window.addEventListener('devicemotion', deviceMotionHandler, false);
        }
        function deviceMotionHandler(eventData) {
          if (!self.canShake) {
            return false;
          }
          const acceleration = eventData.accelerationIncludingGravity;
          const curTime = new Date().getTime();
          if ((curTime - last_update) > 100) {
            const diffTime = curTime - last_update;
            last_update = curTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            const speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
            if (speed > SHAKE_THRESHOLD) {
              if (self.prizeDrawNumber <= 0) {
                alert('您今天的次数用完啦，请明天再来。');
                return false;
              }
              if (self.shakeNum <= 0) {
                $('.bamboo_sticks_box').addClass('bamboo_sticks_box-action');
                $('.bamboo_stick').removeClass('bamboo_stick-action');
              }
              self.shakeNum++;
              clearTimeout(timer);
              timer = setTimeout(function () {
                self.canShake = false;
                $('.bamboo_sticks_box').removeClass('bamboo_sticks_box-action');
                self.getTicket();
                clearTimeout(timer);
                self.shakeNum = 0;
              }, 1000);
            }
            last_x = x;
            last_y = y;
            last_z = z;
          }
        }
      },

      getTicket() {//获得卡券
        const self = this;
        this.loading = true;
        setTimeout(function () {
          const couponBack = getcoupon(self.openId, self.activityId, self.xjjOpenId, 'jushuhui', self.config.host);
          self.loading = false;
          if (couponBack.return_code != '200') {
            alert(couponBack.return_msg);
          } else {
            $('.bamboo_stick').addClass('bamboo_stick-action');
            for (let item of self.images.bamboo_sticks) {
              if (item.item_id == couponBack.item_id) {
                self.bambooStickBg = item.url;
              }
            }
            setTimeout(function () {
              self.prizeInfo = couponBack;
              self.hasShowPrizeResult = true;
              self.prizeDrawNumber--;
              self.setDrawNumber();
            }, 1200);
          }
        }, 120);
      },
      tryAgain(back){ //再来一次
        this.hasShowPrizeResult = false;
        this.canShake = true;
        $('.bamboo_stick').removeClass('bamboo_stick-action');
        this.bambooStickBg = '';
      },
      showSilkBag(){        // 打开锦囊
        if (!this.inDraw) {
          this.hasShowSilkBag = true;
        }
      },
      hideSilkBag(){    //关闭锦囊
        this.hasShowSilkBag = false;
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
    }
  };
</script>
<style scoped lang='less'>
  @import "index";
</style>

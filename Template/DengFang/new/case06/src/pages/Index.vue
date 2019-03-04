<template>
  <section id="template">
    <div class="loading" v-if="inLoading">
      <img src="../assets/loading-bars.svg">
    </div>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide swiper-no-swiping">
          <section class="dialog-home" @touchstart="startHome" @touchmove="moveHome" @touchend="showDialog">
            <div class="home-datetime">
              <p class="home-time" v-html="nowTime"></p>
              <p class="home-date"><span v-html="nowDate"></span><span v-html="week"></span></p>
            </div>
            <div class="home-information" v-if="showHomeInfo">
              <div class="information-icon"></div>
              <div class="information-content">
                <p><span>微信</span><span>现在</span></p>
                <p>娘子: <span v-html="homeInformation"></span></p>
                <p>滑动来查看</p>
              </div>
            </div>
            <div class="home-button" v-if="showHomeInfo">
              <span>滑动来解锁</span>
            </div>
          </section>
          <section class="dialog-list">
            <div class="dialog-one" v-for="item of dialogList" :key="item.type">
              <div class="dialog-default" v-if="item.type === 'default'">
                <div class="default-portrait"></div>
                <div class="default-content" v-html="item.content"></div>
              </div>
              <div class="dialog-user" v-if="item.type === 'user'">
                <div class="user-portrait" :style='{backgroundImage:"url("+headImg+")"}'></div>
                <div class="user-content" v-html="item.content"></div>
              </div>
            </div>
            <div class="dialog-bottom"></div>
            <div class="dialog-arrow" v-if="showArrow" @click="toActivity"></div>
          </section>
        </div>
        <div class="swiper-slide">
          <Activity :activityInfo="activityInfo" v-on:child-say="activityBack"></Activity>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  //引入声音插件
  require('howler');
  //引入活动组件
  import Activity from "../components/Activity.vue";
  import {authorize} from '../services/authorize';
  import {getHeadImg} from '../services/getHeadImg';
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
        swiper: {},
        // ---------------------私有属性-----------------------
        headImg: '',
        activityInfo: {},
        dialogList: [], //当前对话列表
        dialogIndex: 0,
        nowTime: '',
        nowDate: '',
        week: '',
        hasStart: false,
        homeInformation: '',
        showHomeInfo: false,
        showArrow: false,
        sound: {},
        pageX: 0,
        translateNumber: 0,
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
          authorize(this.activityId, this.openId, this.from, this.storeCode);
        }
      },
      start(){ // 模板执行入口方法
        getConfig(res => {
          const self = this;
          this.config = res;
          getHeadImg(this.openId, res.host, res => {
            this.headImg = res.headImg;
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
              this.homeInformation = this.config.dialog_list[0].content;
              if (typeof WeixinJSBridge !== 'undefined') {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                  //实例化Howl对象
                  self.sound = new Howl({
                    src: self.music,
                    format: ['mp3', 'wav'],
                    html5: true,
                    mobileAutoEnable: true,
                  });
                  self.sound.on('load', function () {
                    self.inLoading = false;
                    self.showHome();
                  });
                });
              } else {
                self.sound = new Howl({
                  src: self.music,
                  format: ['mp3', 'wav'],
                  html5: true,
                  mobileAutoEnable: true,
                });
                this.inLoading = false;
                this.showHome();
              }
            });
          });
        });
        console.log(this.activityInfo);
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
      showHome(){
        const self = this;
        const now = new Date();
        this.nowTime = this.checkedNumber(now.getHours()) + ':' + this.checkedNumber(now.getMinutes());
        this.nowDate = this.checkedNumber(now.getMonth()) + '月' + this.checkedNumber(now.getDate());
        let day = '';
        switch (now.getDay()) {
          case 1:
            day = '一';
            break;
          case 2:
            day = '二';
            break;
          case 3:
            day = '三';
            break;
          case 4:
            day = '四';
            break;
          case 5:
            day = '五';
            break;
          case 6:
            day = '六';
            break;
          case 7:
            day = '日';
            break;
        }
        this.week = '星期' + day;
        setTimeout(function () {
          if (typeof WeixinJSBridge !== 'undefined') {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
              self.sound.play();
              self.showHomeInfo = true;
            });
          } else {
            self.sound.play();
            self.showHomeInfo = true;
          }
        }, 500);
      },
      startHome(e){
        if (this.showHomeInfo) {
          const t = e.touches[0];
          this.pageX = t.pageX;
        }
      },
      moveHome(e){
        if (this.showHomeInfo) {
          const t = e.touches[0];
          this.translateNumber = t.pageX - this.pageX;
          if (this.translateNumber <= 0) {
            this.translateNumber = 0;
          }
          $('.dialog-home').css({
            '-webkit-transform': 'translate3d(' + this.translateNumber + 'px,0,0)',
            'transform': 'translate3d(' + this.translateNumber + 'px,0,0)',
          });
        }
      },
      showDialog(){
        if (this.showHomeInfo) {
          if (this.translateNumber <= 100) {
            $('.dialog-home').css({
              '-webkit-transform': 'translateX(0px)',
              'transform': 'translateX(0px)',
              '-webkit-transition': '-webkit-transform 0.3s',
              'transition': 'transform 0.3s',
            });
          } else {
            const w = $('.dialog-home').width();
            $('.dialog-home').css({
              '-webkit-transform': 'translate3d(' + w + 'px,0,0)',
              'transform': 'translate3d(' + w + 'px,0,0)',
              '-webkit-transition': '-webkit-transform 0.3s',
              'transition': 'transform 0.3s',
            });
            setTimeout(this.addDialog, 500);
          }
        }
      },
      addDialog(){
        const self = this;
        this.dialogList.push(this.config.dialog_list[this.dialogIndex]);
        if (this.config.dialog_list[this.dialogIndex].type === 'default') {
          if (typeof WeixinJSBridge !== 'undefined') {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
              self.sound.play();
            });
          } else {
            self.sound.play();
          }
        }
        this.dialogIndex++;
        if (this.dialogIndex >= this.config.dialog_list.length) {
          $('.swiper-slide').removeClass('swiper-no-swiping');
          this.showArrow = true;
          return false;
        }
        const s = Math.random() * 1000 + 1000;
        setTimeout(this.addDialog, s);
      },
      toActivity(){
        this.swiper.slideTo(2, 800, false)
      },
      checkedNumber (num){
        return num < 10 ? '0' + num : num;
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

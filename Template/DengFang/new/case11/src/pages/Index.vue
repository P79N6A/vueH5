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
    <div class="silk-bag-icon" v-if="!gameStart" :style='{backgroundImage:"url("+images.silk_bag_image+")"}'
         @click="showSilkBag"></div>
    <!--模板私有内容 -->
    <div class="luck-card">
      <div class="home" v-if="!gameStart" :style='{backgroundImage:"url("+images.home_bg_image+")"}'>
        <!--剩余抽奖次数 -->
        <div class="prize-draw-number-text" v-html="prizeDrawNumberText"></div>
        <div class="join" :style='{backgroundImage:"url("+images.join_btn+")"}' @click="startGame"></div>
      </div>
      <!--卡牌展示区域-->
      <div class="cards" v-if="gameStart" :style='{backgroundImage:"url("+images.list_bg+")"}'>
        <div class="time-down"><span>倒计时: </span><span v-html="gameTime"></span></div>
        <div class="card-list">
          <div class="card-one" v-for="card,index of endList" @click="deal(card,index)">
            <div class="card-one-image card-one-up" :style='{backgroundImage:"url("+card.defaultUrl+")"}'></div>
            <div class="card-one-image card-one-down" :style='{backgroundImage:"url("+card.clickUrl+")"}'></div>
          </div>
        </div>
      </div>
      <div class="mask" v-if="showMask"></div>
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
        showMask: false,
        gameStart: false,
        wxConfig: {},
        gameTime: 0,
        defaultList: [],
        endList: [],
        lastClick: {},
        clickNum: 0,
        inDeal: false,
        rightNum: 0,
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
      'showFriend': 'wxShare'
    },
    methods: {
      checkedRouter(){
        //获取路由上的参数
        this.cardId = this.getVal('cardId') ? this.getVal('cardId') : this.$route.query.cardId;
        this.openId = this.getVal('openId') ? this.getVal('openId') : this.$route.query.openid;
        this.activityId = this.getVal('activity_id') ? this.getVal('activity_id') : this.$route.query.activity_id;
        this.defaultFrom = this.getVal('defaultFrom') ? this.getVal('defaultFrom') : this.$route.query.defaultFrom;
        this.storeCode = this.getVal('store_code') ? this.getVal('store_code') : this.$route.query.store_code;
        const share = this.getVal('share');
        this.xjjOpenId = this.$route.query.xjj_openId;
        // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
        if (this.xjjOpenId !== "" && typeof this.xjjOpenId !== 'undefined' && this.xjjOpenId !== null) {
          this.start();
        } else {
          authorize(this.activityId, this.openId, this.defaultFrom, this.storeCode, this.cardId, share);
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
            if (item === 'card_list') {
              for (let card of  this.config.images[item]) {
                this.imageArr.push({
                  key: 'card',
                  val: card.image_url
                });
                this.defaultList.push({
                  id: card.item_id,
                  defaultUrl: defaultImage,
                  clickUrl: card.image_url,
                  hasClick: false
                }, {
                  id: card.item_id,
                  defaultUrl: defaultImage,
                  clickUrl: card.image_url,
                  hasClick: false
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
            this.setConfig();
          });
        });
      },
      loadImages(callback){        // 加载图片
        const self = this;
        let oImage = new Image();
        oImage.src = this.imageArr[this.iCur].val;
        oImage.onload = function () {
          if (self.imageArr[self.iCur].key === 'share_image') {
            self.shareImg = oImage;
          }
          self.iCur++;
          if (self.iCur < self.imageArr.length) {
            self.loadImages(callback);
          } else {
            callback(1);
          }
        };
      },
      setConfig(){
        //设置次数提示
        const prizeDrawNumberText = this.config.tooltips.prize_draw_number;
        this.prizeDrawNumberText = prizeDrawNumberText.replace("{n}",
          '<span style="color: goldenrod"> ' + this.prizeDrawNumber + ' </span>');
        this.inLoading = false;
      },
      startGame(){
        this.rightNum = 0;
        this.inDeal = false;
        this.gameTime = this.config.gameTime;
        this.endList = [];
        this.endList = this.randomArray(this.defaultList);
        this.gameStart = true;
        this.prizeDrawNumber--;
        this.setConfig();
        setTimeout(this.timeDown, 1000);
      },
      randomArray(arr) {
        const len = arr.length;
        for (let i = 0; i < len - 1; i++) {
          const idx = Math.floor(Math.random() * (len - i));
          const temp = arr[idx];
          arr[idx] = arr[len - i - 1];
          arr[len - i - 1] = temp;
          arr[idx].hasClick = false;
          arr[len - i - 1].hasClick = false;
        }
        return arr;
      },
      timeDown(){
        if (this.rightNum === this.endList.length / 2) {
          return false;
        }
        this.gameTime--;
        if (this.gameTime < 1) {
          this.getTicket(false);
          return false;
        }
        setTimeout(this.timeDown, 1000);
      },
      deal(card, index){
        const self = this;
        const isSelf = index === this.lastClick.index;
        if (this.inDeal || card.hasClick || isSelf) {
          return false;
        }
        this.inDeal = true;
        this.clickNum++;
        $('.card-one').eq(index).find('.card-one-up').addClass('card-action-up');
        setTimeout(function () {
          $('.card-one').eq(index).find('.card-one-down').addClass('card-action-down');
          setTimeout(function () {
            if (self.clickNum === 2) {
              self.clickNum = 0;
              if (card.id === self.lastClick.id) {
                self.isRight(index)
              } else {
                self.isError(index);
              }
            } else {
              self.lastClick = card;
              self.lastClick.index = index;
              self.inDeal = false;
            }
          }, 250);
        }, 250);
      },
      isRight(index){
        const self = this;
        setTimeout(function () {
          $('.card-one').eq(index).find('.card-one-down').addClass('card-right');
          $('.card-one').eq(self.lastClick.index).find('.card-one-down').addClass('card-right');
          self.inDeal = false;
          self.endList[index].hasClick = true;
          self.endList[self.lastClick.index].hasClick = true;
          self.rightNum++;
          if (self.rightNum === self.endList.length / 2) {
            setTimeout(function () {
              self.getTicket(true);
            }, 800);
          }
        }, 500);
      },
      isError(index) {
        const self = this;
        setTimeout(function () {
          $('.card-one').eq(index).find('.card-one-down').removeClass('card-action-down').addClass('card-default-down');
          $('.card-one').eq(self.lastClick.index).find('.card-one-down').removeClass('card-action-down').addClass('card-default-down');
          setTimeout(function () {
            $('.card-one').eq(index).find('.card-one-up').removeClass('card-action-up').addClass('card-default-up');
            $('.card-one').eq(self.lastClick.index).find('.card-one-up').removeClass('card-action-up').addClass('card-default-up');
            setTimeout(function () {
              $('.card-one').eq(index).find('.card-one-down').removeClass('card-default-down');
              $('.card-one').eq(self.lastClick.index).find('.card-one-down').removeClass('card-default-down');
              $('.card-one').eq(index).find('.card-one-up').removeClass('card-default-up');
              $('.card-one').eq(self.lastClick.index).find('.card-one-up').removeClass('card-default-up');
              self.lastClick = {};
              self.inDeal = false;
            }, 250);
          }, 250);
        }, 500);
      },
      getTicket(over) {//获得卡券
        const self = this;
        this.loading = true;
        setTimeout(function () {
          const couponBack = getcoupon(over, self.openId, self.activityId, self.xjjOpenId, 'jushuhui', self.config.host);
          self.loading = false;
          if (couponBack.return_code != '200') {
            alert(couponBack.return_msg);
          } else {
            self.prizeInfo = couponBack;
            self.hasShowPrizeResult = true;
          }
        }, 50);
      },
      tryAgain(back){ //再来一次
        this.hasShowPrizeResult = false;
        this.gameStart = false;
        $('.card-one').find('.card-one-down').removeClass('card-default-down');
        $('.card-one').find('.card-one-up').removeClass('card-right');
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

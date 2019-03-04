<template>
  <section id="template">
    <div class="loading" v-if="inLoading ">
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
      <div class="home" v-if="!showList" :style='{backgroundImage:"url("+images.home_bg_image+")"}'>
        <!--剩余抽奖次数 -->
        <div class="prize-draw-number-text" v-html="prizeDrawNumberText"></div>
        <div class="join" :style='{backgroundImage:"url("+images.join_btn+")"}' @click="setCard(null)"></div>
      </div>
      <!--福卡展示区域-->
      <div class="card-list" v-if="showList" :style='{backgroundImage:"url("+images.list_bg+")"}'>
        <!--大福卡-->
        <div class="card-big" :class="showStyle?'card-action':''" @touchstart="startMove"
             @touchmove="inMoving" @touchend="endMove">
          <div class="card-big-parent">
            <div class="card-big-child" v-if="aCardList.num <= 0"
                 :style='{backgroundImage:"url("+aCardList.url+")"}'>
              <!--合成-->
              <div class="synthesis" v-if="canToCompound"
                   :style='{backgroundImage:"url("+images.synthesis+")"}' @click="toSynthesis"></div>
            </div>
            <div class="card-big-child" v-if="aCardList.num > 0" v-for="card of aCardList.list"
                 :style='{backgroundImage:"url("+aCardList.url+")"}' @click="getTicket(aCardList)">
              <!--非金卡展示-->
              <span>{{aCardList.num}}</span>
              <div v-if="!aCardList.isGold && aCardList.num > 0">
                <div class="getFriend" @click="getFriend(aCardList)">送一张给朋友</div>
              </div>
              <!--金卡展示-->
              <div v-if="aCardList.isGold">
                <!--合成-->
                <div class="synthesis" v-if="canToCompound && !hasSynthesis"
                     :style='{backgroundImage:"url("+images.synthesis+")"}' @click="toSynthesis"></div>
              </div>
            </div>
          </div>
        </div>
        <!--小福卡-->
        <div class="card-sm-list">
          <div class="card-sm" v-for="item of cardList" :key="item.card.item_id"
               :style='{backgroundImage:"url("+item.show +")"}' @click="showSm(item)">
            <div class="card-sm-number" v-if="item.num > 0" v-html="'+'+item.num"></div>
          </div>
        </div>
        <!--剩余抽奖次数 -->
        <div class="prize-draw-number-text" v-html="prizeDrawNumberText"></div>
        <div class="try-again" @click="againGetCard">再来一次</div>
      </div>
      <div class="tooltips" v-if="showGetFriend" @click="hideGetFriend">
        <div class="mask"></div>
        <div class="tooltips-image" :style='{backgroundImage:"url("+images.tooltip +")"}'></div>
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
  //获取微信签名注册
  import{getWXConfig} from '../services/getWXConfig';
  //获取好友帮助详情
  import{getCardList} from '../services/getCardList';
  import{getCard} from '../services/getCard';
  import{compoundCard} from '../services/compoundCard';
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
        // ---------------------私有属性-----------------------
        showList: false,
        shareImg: {},
        prizeDrawNumberText: '', //抽奖次数提示语
        prizeDrawNumber: 500000,
        hasShowPrizeResult: false, //是否展示抽奖结果
        prizeInfo: {},
        defaultHelperList: 5,
        cardList: [],
        aCardList: {
          num: 0,
          url: '',
          isGold: false
        },
        showStyle: false,
        inDraw: false,
        showGetFriend: false,
        canToCompound: false,
        nowItemId: -1,
        nowCardId: -1,
        moveStartNum: 0,
        moveDistance: 0,
        cardIndex: 0,
        wxConfig: {},
        hasSynthesis: false
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
//        alert(window.location);
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
          // 组合模板图片地址进行预加载
          for (let item in  this.config.images) {
            if (item === 'luck_card') {
              for (let card of  this.config.images[item]) {
                this.imageArr.push({
                  key: 'big_light',
                  val: card.big_light
                }, {
                  key: 'big_gray',
                  val: card.big_gray
                }, {
                  key: 'sm_light',
                  val: card.sm_light
                }, {
                  key: 'sm_gray',
                  val: card.sm_gray
                });
                this.cardList.push({
                  card: card,
                  show: card.sm_gray,
                  num: 0
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
            this.wxShare();
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
        const self = this;
        getCardList(this.openid, 'xx', 'xx', res => {
          if (res.return_code == 200) {
            if (res.cardList.length <= 0) {
              this.showList = false;
            } else {
              this.showList = true;
              //小福卡展示数据:返回福卡列表存在该福卡，即视为拥有该福卡，改变其展示图片路径和数量
              for (let card of  res.cardList) {
                for (let defaultCard of this.cardList) {
                  if (card.item_id == defaultCard.card.item_id && card.list.length > 0) {
                    defaultCard.list = card.list;
                    defaultCard.num = card.list.length;
                    defaultCard.show = defaultCard.card.sm_light;
                  }
                }
              }
              //改变大福卡展示内容：展示第一张拥有的福卡内容。循环小福卡列表，当遇到福卡数>0即展示，并停止循环
              let isGold = false;
              for (let index in this.cardList) {
                const sm = this.cardList[index];
                if (sm.num > 0) {
                  if (sm.card.item_id == 0) {
                    isGold = true;
                  }
                  this.aCardList.num = sm.num;
                  this.aCardList.url = sm.card.big_light;
                  this.aCardList.isGold = isGold;
                  this.aCardList.list = sm.list;
                  setTimeout(function () {
                    self.changeParentW();
                    $('.card-sm').removeClass('card-sm-active').eq(sm.card.item_id).addClass('card-sm-active');
                  }, 1);
                  this.nowItemId = sm.card.item_id;
                  break;
                }
              }
            }
            //判断是否集齐福卡
            let cardNum = 0;
            for (let card of this.cardList) {
              if (card.num >= 1 && card.card.item_id > 0) {
                cardNum++;
              }
            }
            if (cardNum >= 5) {
              this.canToCompound = true;
              const gold = this.cardList[0];
              this.aCardList.list = gold.list;
              this.aCardList.num = gold.num;
              this.aCardList.url = gold.card.big_gray;
              this.aCardList.isGold = true;
              setTimeout(function () {
                self.changeParentW();
                $('.card-sm').removeClass('card-sm-active').eq(0).addClass('card-sm-active');
              }, 1);
              this.nowItemId = 0;
            }
            //设置次数提示
            const prizeDrawNumberText = this.config.tooltips.prize_draw_number;
            this.prizeDrawNumberText = prizeDrawNumberText.replace("{n}",
              '<span style="color: goldenrod"> ' + this.prizeDrawNumber + ' </span>');
            this.inLoading = false;
            if (typeof this.cardId !== 'undefined') {
              this.setCard(this.cardId);
            }
          }
        });
      },
      setCard(cardId){ // 获取福卡
        const self = this;
        if (this.inDraw) {
          return false
        }
        this.loading = true;
        this.inDraw = true;
        const card_id = cardId;
        getCard(self.openId, cardId, 'xx', 'xx', res => {
          if (res.return_code == 200) {
            if (!card_id) {
              self.prizeDrawNumber--;
              const prizeDrawNumberText = self.config.tooltips.prize_draw_number;
              self.prizeDrawNumberText = prizeDrawNumberText.replace("{n}",
                '<span style="color: goldenrod"> ' + self.prizeDrawNumber + ' </span>');
            }
            self.showList = true;
            self.loading = false;
            const itemId = res.item_id;
            //改变小福卡列表数据
            for (let card of self.cardList) {
              if (itemId == card.card.item_id) {
                if (typeof card.list === 'undefined') {
                  card.list = [{
                    card_id: res.card_id
                  }];
                } else {
                  card.list.push({
                    card_id: res.card_id
                  });
                }
                card.show = card.card.sm_light;
                card.num += 1;
                self.aCardList.list = card.list;
                self.aCardList.num = card.num;
                self.aCardList.url = card.card.big_light;
                self.aCardList.isGold = false;
                self.showStyle = true;
              }
              self.changeParentW();
            }
            setTimeout(function () {
              $('.card-sm').removeClass('card-sm-active').eq(itemId).addClass('card-sm-active');
            }, 1);
            //判断是否激起卡片
            setTimeout(function () {
              //召唤神龙:集齐5张？展示合成：展示兑换/灰色
              let cardNum = 0;
              for (let card of self.cardList) {
                if (card.num >= 1 && card.card.item_id > 0) {
                  cardNum++;
                }
              }
              if (cardNum >= 5) {
                self.canToCompound = true;
                setTimeout(function () {
                  alert('恭喜您，集齐了5张福卡，现在可以兑换金卡啦！');
                  self.inDraw = false;
                  self.showStyle = false;
                  self.synthesis();
                }, 600);
              } else {
                self.inDraw = false;
                self.showStyle = false;
              }

            }, 500);
          }
        });
      },
      againGetCard(){
        if (this.prizeDrawNumber <= 0) {
          alert('您今天的参与次数已用完，记得明天再来！');
          return false;
        }
        if (this.inDraw) {
          return false;
        }
        this.showStyle = false;
        this.setCard(null);
      },

      showSm(item){
        if (this.inDraw || item.card.item_id == this.nowItemId) {
          return false;
        }
        //判断是否拥有这张卡片？展示light：展示gray；
        const isGold = item.card.item_id == 0;
        this.aCardList.isGold = isGold;
        let cardNum = 0;
        this.showStyle = false;
        //获取小福卡内容
        for (let card of this.cardList) {
          if (card.num >= 1 && card.card.item_id > 0) {
            cardNum++;
          }
        }
        //判断是否集齐福卡
        if (cardNum >= 5 && isGold) {
          this.canToCompound = true;
          this.aCardList.num = item.num;
          this.aCardList.url = item.card.big_gray;
        } else {
          //判断是否拥有卡片
          if (item.num >= 1) {
            this.aCardList.url = item.card.big_light;
          } else {
            this.aCardList.url = item.card.big_gray;
          }
          this.aCardList.num = item.num;
        }
        this.aCardList.list = item.list;
        this.nowItemId = item.card.item_id;
        $('.card-sm').removeClass('card-sm-active').eq(item.card.item_id).addClass('card-sm-active');
        this.changeParentW();
      },
      changeParentW(){
        this.cardIndex = 0;
        $('.card-big-parent').css({
          'width': this.aCardList.num * 12.5 + 'rem',
          'transform': 'translateX(0rem)',
          'transition': 'transform 0s'
        });
      },
      startMove(e){
        const t = e.touches[0];
        this.moveStartNum = t.pageX;
      },
      inMoving(e){
        e.preventDefault();
        const t = e.touches[0];
        this.moveDistance = t.pageX - this.moveStartNum;
      },
      endMove(){
        if (this.canToCompound) {
          return false;
        }
        if (this.moveDistance <= -20) {
          if (this.cardIndex < this.aCardList.num - 1) {
            this.cardIndex++;
            $('.card-big-parent').css({
              'transform': 'translateX(' + this.cardIndex * -12.5 + 'rem)',
              'transition': 'transform .6s'
            });
          }
        } else if (this.moveDistance >= 20) {
          if (this.cardIndex > 0) {
            this.cardIndex--;
            $('.card-big-parent').css({
              'transform': 'translateX(' + this.cardIndex * -12.5 + 'rem)',
              'transition': 'transform .6s'
            });
          }
        }
        this.moveDistance = 0;
      },
      synthesis(){//合成金卡
        $('.card-sm').removeClass('card-sm-active').eq(0).addClass('card-sm-active');
        const gold = this.cardList[0];
        this.aCardList.num = gold.num;
        this.aCardList.url = gold.card.big_gray;
        this.aCardList.isGold = true;
        this.changeParentW();
      },
      toSynthesis(){
        if (this.hasSynthesis) {
          return false;
        }
        this.hasSynthesis = true;
        //改变大福卡样式，改变小福卡数组列表

        const self = this;
        this.loading = true;
        this.inDraw = true;
        compoundCard(self.openId, 'xx', 'xx', res => {
          if (res.return_code == 200) {
            //改变状态
            self.loading = false;
            $('.card-big').removeClass('card-action').addClass('card-action-synthesis');
            self.aCardList.isGold = true;
            //修改小福卡的状态
            for (let card of self.cardList) {
              if (res.item_id == card.card.item_id) {
                card.show = card.card.big_light;
                card.num += 1;
                if (typeof card.list === 'undefined') {
                  card.list = [{
                    card_id: res.card_id
                  }];
                } else {
                  card.list.push({
                    card_id: res.card_id
                  });
                }
                self.aCardList.list = card.list;
                self.aCardList.url = card.card.big_light;
                self.aCardList.num = card.num;
                self.changeParentW();
              } else {
                card.num -= 1;
                if (card.num <= 0) {
                  card.show = card.card.big_gray;
                }
              }
            }
            //动画执行完成后放开限制
            setTimeout(function () {
              self.canToCompound = false;
              self.inDraw = false;
              self.hasSynthesis = false;
              $('.card-big').removeClass('card-action').removeClass('card-action-synthesis');
            }, 1000);
          }
        });
      },
      getTicket(card){//获得卡券
        if (!card.isGold || this.canToCompound) {
          return false;
        }
        const cardId = card.list[this.cardIndex];
        const self = this;
        this.loading = true;
        setTimeout(function () {
          const couponBack = getcoupon(cardId, self.openId, self.activityId, self.xjjOpenId, 'jushuhui', self.config.host);
          self.loading = false;
          if (couponBack.return_code != '200') {
            alert(couponBack.return_msg);
          } else {
            self.prizeInfo = couponBack;
            self.hasShowPrizeResult = true;
          }
        }, 50);
      },
      getFriend(card){//分享给朋友
        this.nowCardId = card.list[this.cardIndex].card_id;
        this.showGetFriend = true;
        this.setWXConfig();
      },
      hideGetFriend(){
        this.nowCardId = -1;
        this.showGetFriend = false;
        this.setWXConfig();
      },
      tryAgain(back){ //再来一次
        this.hasShowPrizeResult = false;
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
      wxShare(){
        getWXConfig(res => {
          if (res.return_code == 200) {
            this.wxConfig = {
              appId: res.appId, // 必填，公众号的唯一标识
              timestamp: res.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.nonceStr, // 必填，生成签名的随机串
              signature: res.signature,// 必填，签名，见附录1
            }
          }
          this.setWXConfig();
        });
      },
      setWXConfig(){
        const self = this;
        const title = '集五福';
        const imgUrl = self.shareImg.src;
        let link = '';
        let desc = '';
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端打印出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: this.wxConfig.appId, // 必填，公众号的唯一标识
          timestamp: this.wxConfig.timestamp, // 必填，生成签名的时间戳
          nonceStr: this.wxConfig.nonceStr, // 必填，生成签名的随机串
          signature: this.wxConfig.signature,// 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
          self.inReady = false;
          if (self.nowCardId !== -1) {
            link = window.location.origin + '/?cardId=' + self.nowCardId +
              '&activity_id=' + self.activityId +
              '&store_code=' + self.storeCode +
              '&defaultFrom=' + self.defaultFrom;
            desc = 'Felix分享一张福气卡给你，快来领取吧！';
          } else {
            link = window.location.origin + '/?share=true' +
              '&activity_id=' + self.activityId +
              '&store_code=' + self.storeCode +
              '&defaultFrom=' + self.defaultFrom;
            desc = '集福气，赢大奖。';
          }
          //朋友圈
          wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl,
            success: function () {
            },
            cancel: function () {
            }
          });
          //好友
          wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link,
            imgUrl: imgUrl, // 分享图标
            success: function () {
            },
            cancel: function () {
            }
          });
        });
      },
    }
  }
  ;
</script>
<style scoped lang='less'>
  @import "index";
</style>

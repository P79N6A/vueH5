<template>
  <section id="template">
    <div class="loading" v-if="inLoading || inReady">
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
    <div class="bargain">
      <!--主页面内容 -->
      <section id="home" :style='{backgroundImage:"url("+images.home_bg_image+")"}'>
        <div class="helper-list">
          <div class="helper" v-for="index in defaultHelperList">
            <div class="head-image" :style='{backgroundImage:"url("+images.default_image+")"}'></div>
            <p class="helper-name"></p>
          </div>
        </div>
        <!--剩余抽奖次数 -->
        <div class="prize-draw-number-text" v-html="prizeDrawNumberText" v-if="helpStatus == 'DOING'"></div>
        <div class="prize_draw" v-if="helpStatus == 'DONE'" :style='{backgroundImage:"url("+images.prize_draw+")"}'
             @click="draw"></div>
        <div class="prize-draw-over" v-if="helpStatus == 'FINISHED'">已领取，请在锦囊中查看</div>
        <!--开奖结果组件-->
        <PrizeResult :prizeInfo="prizeInfo" v-if="hasShowPrizeResult" @tryAgain="tryAgain"></PrizeResult>
        <Loading v-if="loading"></Loading>
      </section>
      <!--分享页面内容 -->
      <section id="friend" :style='{backgroundImage:"url("+images.friend_bg_image+")"}' v-if="showFriend">
        <div class="try" @click="tryTodo">
          <span>我也试试</span>
        </div>
      </section>
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
  import{getDetails} from '../services/getDetails';
  //好友帮助事件
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
        from: '',
        storeCode: '',
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
        helperList: [],
        showFriend: false,
        shareImg: {},
        prizeDrawNumberText: '', //抽奖次数提示语
        helpEnd: false,
        helpStatus: '',
        hasShowPrizeResult: false, //是否展示抽奖结果
        prizeInfo: {},
        defaultHelperList: 5,
        styleIndex: 0,
        friendOpenId: '',
        wxConfig: {}
      }
    },
    created(){      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      document.querySelector("body").addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      this.checkedRouter();
    },
    watch: {
      '$route': 'checkedRouter'
    },
    methods: {
      checkedRouter(){
        //获取路由上的参数
        this.friendOpenId = this.getVal('friendOpenId') ? this.getVal('friendOpenId') : this.$route.query.friendOpenId;
        this.openId = this.getVal('openId') ? this.getVal('openId') : this.$route.query.openid;
        this.activityId = this.getVal('activity_id') ? this.getVal('activity_id') : this.$route.query.activity_id;
        this.defaultFrom = this.getVal('defaultFrom') ? this.getVal('defaultFrom') : this.$route.query.defaultFrom;
        const share = this.getVal('share');
        this.xjjOpenId = this.$route.query.xjj_openId;
        // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
        if (this.xjjOpenId !== "" && typeof this.xjjOpenId !== 'undefined' && this.xjjOpenId !== null) {
          this.start();
        } else {
          authorize(this.activityId, this.openId, this.defaultFrom, this.storeCode, this.friendOpenId);
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
            this.imageArr.push({
              id: null,
              key: item,
              val: this.config.images[item]
            });
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
        //根据friendOpenId来区分展示相应内容
        const friendOpenId = typeof this.friendOpenId == 'undefined' ? this.openId : this.friendOpenId;
        getDetails(this.openId, friendOpenId, this.config.host, res => {
          if (res.return_code == 200) {
            if (this.openId !== friendOpenId) {
              this.setWXConfig();
              this.showFriend = true;
            } else {
              this.helperList = res.helperList;
              this.showFriend = false;
              this.helpStatus = res.status;
              if (this.helperList.length > 0) {
                setTimeout(this.setItemStyle, 150);
              }
              const prizeDrawNumber = this.defaultHelperList - this.helperList.length;
              const prizeDrawNumberText = this.config.tooltips.prize_draw_number;
              this.prizeDrawNumberText = prizeDrawNumberText.replace("{n}",
                '<span style="color: #fff"> ' + prizeDrawNumber + ' </span>');
            }
            this.inLoading = false;
          }
        });
      },
      setItemStyle(){
        if (this.helpStatus == 'FINISHED') {
          for (let i  in this.helperList) {
            $('.head-image').eq(i).css({
              'background-image': 'url("' + this.helperList[i].headImage + '")',
            });
            $('.helper-name').eq(i).html(this.helperList[i].name);
          }
        } else {
          $('.head-image').eq(this.styleIndex).css({
            'background-image': 'url("' + this.helperList[this.styleIndex].headImage + '")',
          }).addClass('head-image-action');
          $('.helper-name').eq(this.styleIndex).html(this.helperList[this.styleIndex].name);
          this.styleIndex++;
          if (this.styleIndex >= this.helperList.length) {
            if (this.helperList.length === this.defaultHelperList) {
              this.helpEnd = true;
            }
            return false;
          }
          setTimeout(this.setItemStyle, 500);
        }
      },
      draw(){
        const self = this;
        this.loading = true;
        setTimeout(function () {
          const couponBack = getcoupon(self.openId, self.activityId, self.xjjOpenId, 'jushuhui', self.config.host);
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
        this.styleIndex = 0;
        this.helpEnd = false;
        $('.head-image').css({
          'background-image': 'url("' + this.images.default_image + '")',
        }).removeClass('head-image-action');
        $('.helper-name').html('');
        this.setConfig();
      },
      tryTodo(){
        this.friendOpenId = undefined;
        this.setConfig();
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
        const title = '拆礼包';
        const imgUrl = self.shareImg.src;
        let link = '';
        let desc = '';
        if (!this.showFriend) {
          link = window.location.origin + '/?friendOpenId=' + self.openId +
            '&activity_id=' + self.activityId +
            '&store_code=' + self.storeCode +
            '&defaultFrom=' + self.defaultFrom;
          desc = 'Felix邀请你来帮忙！';
        } else {
          link = window.location.origin + '/?share=true' +
            '&activity_id=' + self.activityId +
            '&store_code=' + self.storeCode +
            '&defaultFrom=' + self.defaultFrom;
          desc = '拆礼包。';
        }
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: this.wxConfig.appId, // 必填，公众号的唯一标识
          timestamp: this.wxConfig.timestamp, // 必填，生成签名的时间戳
          nonceStr: this.wxConfig.nonceStr, // 必填，生成签名的随机串
          signature: this.wxConfig.signature,// 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
          self.inReady = false;
          wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl,
            success: function () {
            },
            cancel: function () {
            }
          });
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
  };
</script>
<style scoped lang='less'>
  @import "index";
</style>

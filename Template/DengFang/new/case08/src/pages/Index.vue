<template>
  <section id="template">
    <div class="loading" v-if="inLoading ">
      <img src="../assets/loading-bars.svg">
    </div>
    <!--音乐播放/暂停按钮-->
    <div class="music-image" :class='inPlay?"music-active":""'
         :style='{backgroundImage:"url("+images.music_image+")"}'
         @click="playMusic"></div>
    <!--音乐播放器-->
    <audio loop="loop" id="audio" :src="music"></audio>
    <!--锦囊按钮-->
    <div class="silk-bag-icon" :style='{backgroundImage:"url("+images.silk_bag_image+")"}'
         @click="showSilkBag"></div>
    <!--模板私有内容 -->
    <div class="bargain">
      <List v-if="show === 'list'" @toBargain="toBargain"></List>
      <Bargain v-if="show === 'bargain'" @tryAgain="tryAgain"></Bargain>
      <FriendBargain v-if="show === 'friendBargain'" @friendTty="friendTty"></FriendBargain>
    </div>
    <!--锦囊组件-->
    <SilkBag v-if="hasShowSilkBag" v-on:child-say="hideSilkBag"></SilkBag>
    <Loading v-if="loading"></Loading>
  </section>
</template>
<script>
  //引入锦囊组件
  import SilkBag from "../components/SilkBag.vue";
  import Loading from '../components/Loading.vue';
  import List from '../components/Home.vue';
  import Bargain from '../components/Bargain.vue';
  import FriendBargain  from '../components/FriendBargain.vue';
  import {authorize} from '../services/authorize';
  //引入json文件
  import{getConfig} from '../services/getConfig';
  import{getDetails} from '../services/getDetails';
  //获取微信签名注册
  import{getWXConfig} from '../services/getWXConfig';
  export default {
    //注册引入的组件
    components: {
      SilkBag,
      Loading,
      List,
      Bargain,
      FriendBargain
    },
    data() {
      return {
        // ---------------------共用属性-----------------------
        xjjOpenId: '',
        openId: '',
        activityId: '',
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
        hasBargain: false, //是否确认砍价对象
        details: {}, //砍价对象详情
        //-------------------------
        show: '',
        shareImage: {},
        wxConfig: {},
        shareId: -1,
        bargainList: [],
        bargain: {}
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
      'show': 'setWXConfig'
    },
    methods: {
      checkedRouter(){
        //获取路由上的参数
        let locaURL = window.location.href;
        alert(locaURL);
        let hasWXFrom = this.getVal(locaURL, 'from');
        //去除#，微信的from字段，重组链接
        if (typeof hasWXFrom !== 'undefined') {
          const urlHost = window.location.href.split('#')[0];
          const urlArr = urlHost.split('?')[1].split('&');
          let urlStr = '';
          for (let i in urlArr) {
            /* if (urlArr[i] !== 'from=singlemessage') {
             urlStr += urlArr[i] + '&'
             }*/
            if (urlArr[i].indexOf('from') < 0) {
              urlStr += urlArr[i] + '&'
            }
          }
          locaURL = urlHost.split('?')[0] + '#/?' + urlStr.substring(0, urlStr.length - 1);
        }
        alert(locaURL);
        this.friendOpenId = this.getVal(locaURL, 'friendOpenId') ? this.getVal(locaURL, 'friendOpenId') : this.$route.query.friendOpenId;
        this.openId = this.getVal(locaURL, 'openid') ? this.getVal(locaURL, 'openid') : this.$route.query.openid;
        this.activityId = this.getVal(locaURL, 'activity_id') ? this.getVal(locaURL, 'activity_id') : this.$route.query.activity_id;
        this.storeCode = this.getVal(locaURL, 'store_code') ? this.getVal(locaURL, 'store_code') : this.$route.query.store_code;
        this.shareId = this.getVal(locaURL, 'itemId') ? this.getVal(locaURL, 'itemId') : this.$route.query.itemId;
        const share = this.getVal(locaURL, 'share');
        this.xjjOpenId = this.$route.query.xjj_openId;
        alert(this.storeCode);
        // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
        if (this.xjjOpenId !== "" && typeof this.xjjOpenId !== 'undefined' && this.xjjOpenId !== null) {
          this.start();
        } else {
          authorize(locaURL, this.activityId, this.storeCode, this.friendOpenId, this.shareId);
        }
      },
      start(){ // 模板执行入口方法
        getConfig(res => {
          this.config = res;
          this.music = this.config.music;
          // 组合模板图片地址进行预加载
          for (let item in  this.config.images) {
            if (item === 'prize_img_box') {
              for (let p of this.config.images[item]) {
                this.imageArr.push({
                  id: p.item_id,
                  key: 'prize_img',
                  val: p.prize_img
                });
              }
            } else {
              this.imageArr.push({
                id: null,
                key: item,
                val: this.config.images[item]
              });
            }
          }
          // 图片加载完成后进行赋值处理
          this.loadImages((back) => {
            this.images = this.config.images;
            this.setConfig();
            this.wxShare();
          });
        });
      },
      loadImages(callback){        // 加载图片
        const self = this;
        let oImage = new Image();
        oImage.src = this.imageArr[this.iCur].val;
        oImage.onload = function () {
          if (self.imageArr[self.iCur].key === 'share_image') {
            self.shareImage = oImage;
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
        const config = JSON.stringify(this.config);
        sessionStorage.removeItem('config');
        sessionStorage.setItem('config', encodeURI(config));
        const itemId = typeof this.shareId === 'undefined' ? -1 : this.shareId;
        const friendOpenId = typeof this.friendOpenId == 'undefined' ? this.openId : this.friendOpenId;
        if (friendOpenId !== this.openId) {
          //砍价对象ID ，当前用户ID ，好友ID
          getDetails(itemId, this.openId, friendOpenId, this.config.host, res => {
            if (res.return_code == 200) {
              this.bargain = res;
              let detailsStr = {
                item_id: itemId,
                originalPrices: res.originalPrices,
                targetPrices: res.targetPrices,
                cutPrices: res.cutPrices,
                limitPrices: res.limitPrices,
                status: res.status,
                helperList: res.helperList,
                storeCode: res.store_code
              };
              detailsStr = JSON.stringify(detailsStr);
              sessionStorage.removeItem('friendDetails');
              sessionStorage.setItem('friendDetails', encodeURI(detailsStr));
              this.show = 'friendBargain';
              this.inLoading = false;
            }
          });
        } else {
          this.show = 'list';
        }
        this.inLoading = false;
      },
      getVal(str, item) {
//        const aQuery = window.location.href.split("?"); //取得Get参数
        const aQuery = str.split("?"); //取得Get参数
        let aGET = [];
        if (aQuery.length > 1) {
          const aBuf = aQuery[1].split("&");
          for (let i = 0, iLoop = aBuf.length; i < iLoop; i++) {
            const aTmp = aBuf[i].split("="); //分离key与Value
            aGET[aTmp[0]] = decodeURIComponent(aTmp[1]);
          }
        }
        return aGET[item];
      },
      changeURLPar(destiny, par, par_value){
        var pattern = par + '=([^&]*)';
        var replaceText = par + '=' + par_value;
        if (destiny.match(pattern)) {
          var tmp = '/\\' + par + '=[^&]*/';
          tmp = destiny.replace(eval(tmp), replaceText);
          return (tmp);
        }
        else {
          if (destiny.match('[\?]')) {
            return destiny + '&' + replaceText;
          }
          else {
            return destiny + '?' + replaceText;
          }
        }
        return destiny + '\n' + par + '\n' + par_value;
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

      toBargain(back){ //确认砍价对象
        const self = this;
        let detailsStr = {};
        this.loading = true;
        //砍价对象ID ，当前用户ID ，好友ID
        getDetails(back, this.openId, this.openId, this.config.host, res => {
          if (res.return_code == 200) {
            detailsStr = {
              item_id: back,
              originalPrices: res.originalPrices,
              targetPrices: res.targetPrices,
              cutPrices: res.cutPrices,
              limitPrices: res.limitPrices,
              status: res.status,
              helperList: res.helperList,
              storeCode: res.store_code
            };
            self.bargain = detailsStr;
            detailsStr = JSON.stringify(detailsStr);
            sessionStorage.removeItem('details');
            sessionStorage.setItem('details', encodeURI(detailsStr));
            self.show = 'bargain';
            self.loading = false;
          } else {
            alert(res.return_msg);
            self.loading = false;
          }
        });

      },
      tryAgain(back){ //再来一次
        this.show = 'list';
      },
      friendTty(back){ //分享页面--> 我也试试
        sessionStorage.removeItem('friendOpenId');
        this.friendOpenId = undefined;
        this.shareId = undefined;
        this.setConfig();
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
        const title = '好友砍价';
        const imgUrl = self.shareImage.src;
        let link = '';
        let desc = '';

        const urlStr = window.location.href.split('#')[0];
        if (this.show === 'bargain') {
          link = urlStr + '?friendOpenId=' + self.openId +
            '&itemId=' + self.bargain.item_id +
            '&activity_id=' + self.activityId +
            '&store_code=' + self.storeCode;
          desc = 'Felix邀请你来帮忙！';
        } else {
          link = urlStr + '?share=true' +
            '&activity_id=' + self.activityId +
            '&store_code=' + self.storeCode;
          desc = '好友砍价，拼友情。';
        }


        wx.config({
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
        // wx.ready() 结束后面添加
        function onBridgeReady() {
          WeixinJSBridge.call('hideOptionMenu');
        }

        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          onBridgeReady();
        }
        //在setWXConfig()内 最底部添加这个方法
      },
    }
  };
</script>
<style scoped lang='less'>
  #template {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    img {
      width: 100%;
      height: 100%;
    }
    /*加载动画*/
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
    /*背景图片*/
    .bg-image {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    /*音乐组件*/
    .music-image {
      position: fixed;
      top: 1.4rem;
      left: 1rem;
      z-index: 2;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-size: cover;
    }
    .music-active {
      animation: active 1s linear infinite;
      @keyframes active {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }

    /*锦囊*/
    .silk-bag-icon {
      position: fixed;
      top: .5rem;
      right: .5rem;
      z-index: 2;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background-size: cover;
    }
    .bargain {
      position: relative;
      width: 100%;
      height: 100%;
    }

  }

</style>

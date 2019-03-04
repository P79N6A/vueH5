<template>
  <section id="bargain" :style='{backgroundImage:"url("+images.bargain_bg+")"}'>
    <div class="knife-mask" v-if=" first && showKnife">
      <div class="mask"></div>
      <div class="knife-gold">
        <div class="knife"></div>
        <div class="gold"></div>
      </div>
    </div>
    <div class="tooltips" @click="showTooltips = false" v-if=" showTooltips">
      <div class="mask"></div>
      <div class="tooltips-image" :style='{backgroundImage:"url("+images.bargain_tooltip+")"}'></div>
    </div>
    <div class="bargain-prize" :style='{backgroundImage:"url("+prizeImg+")"}'></div>
    <div class="bargain-progress">
      <div class="original-price">
        <p>原价</p>
        <p>￥<span v-html="details.originalPrices"></span></p>
      </div>
      <div class="progress" v-if="status == 'DOING' || status == 'FIRST_BLOOD' ">
        <div class="progress-child"></div>
      </div>
      <div class="progress-end" v-if="status == 'DONE'" @click="showPrize">
        <div class="progress-end-child">
          <span>点击抽奖</span>
        </div>
      </div>
      <div class="progress-end" v-if="status == 'FINISHED'">
        <div class="progress-undo-child">
          <span>已领取，请在锦囊中查看</span>
        </div>
      </div>
      <div class="target">
        <p>目标</p>
        <p>￥<span v-html="details.targetPrices"></span></p>
      </div>
    </div>
    <p class="bargain-progress-text">
      已经砍价 <span v-html="details.cutPrices"></span> 元，还要砍 <span
      v-html="details.limitPrices"></span> 元
    </p>
    <div class="friends">
      <scroller>
        <div class="friend" v-for="helper of details.helperList" :key="helper.name">
          <div class="friend-headImage" :style='{backgroundImage:"url("+helper.headImage+")"}'></div>
          <div class="friend-content">
            <p class="friend-content-text"><span v-html="helper.name"></span> 帮忙砍了</p>
            <p class="friend-content-time" v-html="helper.dateTime"></p>
          </div>
          <div class="friend-bargain"><span v-html="helper.prices"></span>元</div>
        </div>
      </scroller>
    </div>
    <!--开奖结果组件-->
    <PrizeResult :prizeInfo="prizeInfo" v-if="hasShowPrizeResult" @tryAgain="tryAgain"></PrizeResult>
    <Loading v-if="loading"></Loading>
  </section>
</template>
<script>
  //引入开奖结果组件
  import PrizeResult from "./PrizeResult.vue";
  import Loading from './Loading.vue';
  import {getcoupon} from "../services/getcoupon";
  export default {
    components: {
      PrizeResult,
      Loading
    },
    data() {
      return {
        // ---------------------共用属性-----------------------
        xjjOpenId: '',
        openId: '',
        activityId: '',
        //---------------模板链接数据 end-------------
        config: {},
        images: {},
        showTooltips: false,
        showKnife: false,
        bargainEnd: false,
        status: '',
        hasShowPrizeResult: false, //是否展示抽奖结果
        prizeInfo: {},
        loading: false,
        friendHelp: [],
        details: {},
        prizeImg: '',
        scale: 0,
        first: false,
        itemId: ''
      }
    },
    created(){      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      const self = this;
      let locaURL = window.location.href;
      this.openId = this.getVal(locaURL, 'openid') ? this.getVal(locaURL, 'openid') : this.$route.query.openid;
      this.activityId = this.getVal(locaURL, 'activity_id') ? this.getVal(locaURL, 'activity_id') : this.$route.query.activity_id;
      this.xjjOpenId = this.$route.query.xjj_openId;
      let config = sessionStorage.getItem('config');
      config = JSON.parse(decodeURI(config));
      let details = sessionStorage.getItem('details');
      details = JSON.parse(decodeURI(details));
      this.config = config;
      this.images = this.config.images;
      this.showTooltips = false;
      this.details = details;
      this.itemId = details.item_id;
      for (let i of this.images.prize_img_box) {
        if (details.item_id == i.item_id) {
          this.prizeImg = i.prize_img;
        }
      }
      this.status = details.status;
      if (this.status == 'FIRST_BLOOD') {
        this.first = true;
        this.showKnife = true;
        setTimeout(function () {
          console.log(1);
          self.showKnife = false;
          self.setWidth();
        }, 1200);
      } else if (this.status == 'DOING') {
        setTimeout(function () {
          self.setWidth();
        }, 10);
      }
      //在created()方法内最后面添加这段代码，显示分享内容
      function onBridgeReady() {
        WeixinJSBridge.call('showOptionMenu');
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
    },
    methods: {
      setWidth(){
        const self = this;
        this.scale = 11 / (this.details.originalPrices - this.details.targetPrices);
        const w = this.scale * this.details.cutPrices;
        $('.progress-child').css({
          'width': w + 'rem',
          'transition': 'width 1s'
        });
        if (this.first) {
          setTimeout(function () {
            self.showTooltips = true;
          }, 1500);
        }
      },
      showPrize(){ //获取卡券
//        console.log(this.itemId, this.openId, this.activityId, this.xjjOpenId);
        const self = this;
        this.loading = true;
        setTimeout(function () {
          const couponBack = getcoupon(self.itemId, self.openId, self.activityId, self.xjjOpenId, 'jushuhui', self.config.host);
          self.loading = false;
          if (couponBack.return_code != '200') {
            alert(couponBack.return_msg);
          } else {
            self.prizeInfo = couponBack;
            self.hasShowPrizeResult = true;
          }
        }, 50);
      },
      tryAgain(callback){        //再来一次
        this.hasShowPrizeResult = false;
        this.$emit('tryAgain', true);
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
    }
  };

</script>
<style scoped lang='less'>
  #bargain {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 88;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .7);
    }
    .knife-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 90;
      width: 100%;
      height: 100%;
      .knife-gold {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 90;
        margin-left: -5rem;
        margin-top: -5rem;
        width: 10rem;
        height: 10rem;
        .knife {
          width: 7.5rem;
          height: 2.96rem;
          background: url("../assets/knife.png") no-repeat;
          background-size: cover;
          transform-origin: 0 1rem;
          animation: hammer-action .5s ease-in .3s 1 normal;
          -webkit-animation-fill-mode: forwards;
          @keyframes hammer-action {
            0% {

            }
            50% {
              -webkit-transform: rotate(30deg);
              transform: rotate(30deg);
            }
            100% {
              -webkit-transform: rotate(-10deg);
              transform: rotate(-10deg);
            }
          }
        }
        .gold {
          margin: .5rem auto;
          width: 6rem;
          height: 6rem;
          background: url("../assets/gold.png") no-repeat;
          background-size: cover;

        }
      }
      .knife {

      }
    }
    .tooltips {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      height: 100%;
      .tooltips-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 16.15rem;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }

    .bargain-prize {
      position: absolute;
      left: 50%;
      bottom: 20rem;
      -webkit-transform: translateX(-5.75rem);
      transform: translateX(-5.75rem);
      width: 11.5rem;
      height: 7.5rem;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .bargain-progress {
      position: absolute;
      left: 0;
      bottom: 16.75rem;
      width: 100%;
      height: 2rem;
      text-align: center;
      font-size: 0;
      color: #fff;
      .original-price, .target {
        display: inline-block;
        vertical-align: middle;
        font-size: .7rem;
      }
      .progress, .progress-end {
        display: inline-block;
        vertical-align: middle;
        margin: 0 .3rem;
        width: 11rem;
        height: 1.8rem;
        border: 2px solid gold;
        border-radius: .9rem;
        box-shadow: 0 0 1rem rgba(255, 255, 0, .8);
        .progress-child {
          margin: .1rem;
          width: 0;
          height: 1.6rem;
          background: -webkit-gradient(linear, 0 0, 0 bottom, from(#ffd400), to(#ffd400), color-stop(40%, #FCFF58), color-stop(60%, #FCFF58));
          border-radius: .9rem;
        }
      }
    }
    .progress-end {
      .progress-end-child {
        margin: .1rem;
        height: 1.6rem;
        border-radius: .9rem;
        font-size: .8rem;
        color: #fff;
        line-height: 1.6rem;
        background: #ffd400;
      }
      .progress-undo-child {
        margin: .1rem;
        height: 1.6rem;
        border-radius: .9rem;
        font-size: .8rem;
        color: #fff;
        line-height: 1.6rem;
        background: #cccccc;
      }
    }

    .bargain-progress-text {
      position: absolute;
      left: 0;
      bottom: 15.5rem;
      width: 100%;
      font-size: .7rem;
      text-align: center;
      color: #fff;
    }
    .friends {
      position: absolute;
      left: 50%;
      bottom: .5rem;
      -webkit-transform: translateX(-7.875rem);
      transform: translateX(-7.875rem);
      width: 15.75rem;
      height: 10.5rem;
      .friend {
        position: relative;
        padding: .5rem 0;
        box-sizing: border-box;
        width: 100%;
        height: 3.5rem;
        font-size: .7rem;
        .friend-headImage {
          position: absolute;
          left: 0;
          top: .5rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .friend-content {
          padding: .3rem .3rem .3rem 3rem;
          box-sizing: border-box;
          width: 13rem;
          color: #fff;
          .friend-content-time {
            position: absolute;
            bottom: .8rem;
          }
        }
        .friend-bargain {
          position: absolute;
          right: 0;
          bottom: .8rem;
          color: gold;
        }
      }
    }

  }
</style>

<template>
  <section id='activity'>
    <div class="activity-bg" :style='{backgroundImage:"url("+info.activity_bg+")"}'></div>
    <!--锦囊按钮-->
    <div class="silk-bag-icon" :style='{backgroundImage:"url("+info.silk_bag_image+")"}'
         @click="showSilkBag"></div>
    <div class="prize-parent">
      <div class="prize-one" v-for="item of info.prize_img_box" :key="item.id"
           :style='{backgroundImage:"url("+item.prize_img+")"}' @click="showPrize(item)"></div>
    </div>
    <!--锦囊组件-->
    <SilkBag v-if="hasShowSilkBag" v-on:child-say="hideSilkBag"></SilkBag>
    <!--开奖结果组件-->
    <PrizeResult :prizeInfo="prizeInfo" v-if="hasShowPrizeResult" v-on:child-say="tryAgain"></PrizeResult>
    <Loading v-if="loading"></Loading>
  </section>
</template>
<script>
  //引入锦囊组件
  import SilkBag from "./SilkBag.vue";
  //引入开奖结果组件
  import PrizeResult from "./PrizeResult.vue";
  import Loading from '../components/Loading.vue';
  import {getcoupon} from "../services/getcoupon";
  export default {
    props: ['activityInfo'],
    //注册引入的组件
    components: {
      SilkBag,
      PrizeResult,
      Loading
    },
    data() {
      return {
        xjjOpenId: '',
        openId: '',
        activityId: '',
        from: '',
        storeCode: '',
        info: this.activityInfo,
        hasShowSilkBag: false, //是否展示锦囊
        hasShowPrizeResult: false, //是否展示抽奖结果
        prizeInfo: {},
        loading: false
      }
    },
    created(){
      this.changeInfo();
    },
    watch: {
      'activityInfo.prize_img_box': 'changeInfo'
    },
    methods: {
      changeInfo(){
        this.info = this.activityInfo;
        const ids = this.info.ids;
        if (ids) {
          this.xjjOpenId = ids.xjjOpenId;
          this.openId = ids.openId;
          this.activityId = ids.activityId;
          this.from = ids.from;
          this.storeCode = ids.storeCode;
        }
      },
      hideFollowUs(){
        this.$emit('child-say', false);
      },
      showSilkBag(){        // 打开锦囊
        this.hasShowSilkBag = true;
        this.$emit('child-say', true);
      },
      hideSilkBag(){    //关闭锦囊
        this.hasShowSilkBag = false;
        this.$emit('child-say', false);
      },
      showPrize(item){ //获取卡券
        const self = this;
        this.loading = true;
        setTimeout(function () {
          const couponBack = getcoupon(item.item_id, self.openId, self.activityId, self.xjjOpenId, 'jushuhui', self.info.host);
          self.loading = false;
          if (couponBack.return_code != '200') {
            alert(couponBack.return_msg);
          } else {
            self.prizeInfo = couponBack;
            self.hasShowPrizeResult = true;
            self.$emit('child-say', true);
          }
        }, 50);
      },
      tryAgain(callback){        //再来一次
        this.hasShowPrizeResult = false;
        this.$emit('child-say', false);
      },
    }
  }
</script>
<style lang="less" scoped>
  #activity {
    position: relative;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    /*height: 603px;*/
    height: 100%;
    .activity-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .prize-parent {
      position: absolute;
      left: 50%;
      bottom: 3rem;
      margin-left: -7rem;
      width: 14rem;
      height: 18rem;
      font-size: 0;
      line-height: 0;
      .prize-one {
        display: inline-block;
        width: 6.75rem;
        height: 8.75rem;
        background-repeat: no-repeat;
        background-size: cover;
        vertical-align: middle;
      }
      .prize-one:nth-child(2n-1) {
        margin-right: .5rem;
      }
      .prize-one:first-child {
        margin-bottom: .5rem;
      }
      .prize-one:nth-child(2) {
        margin-bottom: .5rem;
      }
    }
    /*锦囊*/
    .silk-bag-icon {
      position: absolute;
      top: .5rem;
      right: .5rem;
      z-index: 2;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background-size: cover;
    }
  }
</style>

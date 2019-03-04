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
  </section>
</template>
<script>
  //引入锦囊组件
  import SilkBag from "./SilkBag.vue";
  //引入开奖结果组件
  import PrizeResult from "./PrizeResult.vue";
  export default {
    props: ['activityInfo'],
    //注册引入的组件
    components: {
      SilkBag,
      PrizeResult
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
      }
    },
    created(){
      this.info = this.activityInfo;
      // 获取链接参数
      this.xjjOpenId = this.$route.query.xjj_openId;
      this.openId = this.$route.query.openid;
      this.activityId = this.$route.query.activity_id;
      this.from = this.$route.query.from;
      this.storeCode = this.$route.query.store_code;
    },
    watch: {
      'activityInfo.prize_img_box': 'changeInfo'
    },
    methods: {
      changeInfo(){
        this.info = this.activityInfo;
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
      showPrize(item){ //打开按钮相关奖项
        this.prizeInfo = item;
        this.hasShowPrizeResult = true;
        this.$emit('child-say', true);
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

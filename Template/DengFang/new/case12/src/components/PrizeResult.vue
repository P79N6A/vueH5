<template>
  <section id="prizeResultResult">
    <div class="mask"></div>
    <div class="prize-result-cnt" v-if="parseInt(info.item_id) !== -1">
      <div class="prize-result-content">
        <p class="prize-result-title">恭喜您!</p>
        <div class="prize-result-describe">
          <p>您获得了</p>
          <div class="prize-result-details">
            <div class="coupons-image" :style='{backgroundImage:"url("+info.logo+")"}'></div>
            <div class="coupons-title" v-html="info.title">
            </div>
          </div>
          <div class="view-now" @click="toLink">立即查看</div>
        </div>
      </div>
    </div>
    <div class="prize-result-cnt" v-if="parseInt(info.item_id) === -1">
      <div class="prize-result-content">
        <p class="prize-result-title">很遗憾!</p>
        <div class="prize-result-describe">
          <img src="../assets/prize-none.png" alt="">
        </div>
      </div>
    </div>
    <div class="again" @click="tryAgain">再来一次</div>
  </section>
</template>
<script>
  export default {
    props: ['prizeInfo'],
    data() {
      return {
        info: this.prizeInfo
      }
    },
    created(){
      this.info = this.prizeInfo;
    },
    watch: {
      'prizeInfo.item_id': 'changDate'
    },
    methods: {
      changDate(){
        this.info = this.prizeInfo;
      },
      toLink(){
        window.location.href = this.info.coupon_url;
      },
      tryAgain(){
        this.$emit('tryAgain', true);
      },
    }
  }
</script>
<style lang="less" scoped>
  @fontSize: 40rem;
  #prizeResultResult {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 101;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .8);
    }
    .prize-result-cnt {
      position: fixed;
      bottom: 230/@fontSize;
      left: 0;
      z-index: 102;
      width: 100%;
      height: 880/@fontSize;
      color: #fff;
      background: url("../assets/prize-result-bg.png") no-repeat;
      background-size: cover;
      .prize-result-content {
        position: absolute;
        bottom: 0;
        z-index: 203;
        width: 100%;
        text-align: center;
        .prize-result-title {
          font-size: 48/@fontSize;
          margin-bottom: 56/@fontSize;
        }
        .prize-result-describe {
          position: relative;
          margin: 0 auto;
          width: 480/@fontSize;
          height: 530/@fontSize;
          color: #e8000d;
          font-size: 32/@fontSize;
          font-weight: 700;
          .prize-result-details {
            position: relative;
            margin: 40/@fontSize 0;
            padding: 20/@fontSize 0;
            box-sizing: border-box;
            height: 280/@fontSize;
            font-size: 0;
            text-align: left;
            background: #cb2925;
            border: 20/@fontSize solid #e8000d;
            .coupons-image {
              display: inline-block;
              vertical-align: middle;
              margin: 20/@fontSize 16/@fontSize;
              width: 160/@fontSize;
              height: 160/@fontSize;
              background-size: cover;
            }
            .coupons-title {
              position: absolute;
              right: 0;
              top: 20/@fontSize;
              width: 248/@fontSize;
              height: 200/@fontSize;
              font-size: 32/@fontSize;
              color: #fff;
              text-align: center;
              border-left: 2/@fontSize solid #fff;
              display: -webkit-box;
              -webkit-box-orient: horizontal;
              -webkit-box-pack: center;
              -webkit-box-align: center;
              display: box;
              box-orient: horizontal;
              box-pack: center;
              box-align: center;
            }
          }
          .view-now {
            height: 80/@fontSize;
            text-align: center;
            color: #fff;
            font-size: 32/@fontSize;
            line-height: 80/@fontSize;
            background: #e8000d;
            border-radius: 10/@fontSize;
          }
        }
      }
    }
    .again {
      position: absolute;
      left: 50%;
      bottom: 110/@fontSize;
      z-index: 102;
      margin-left: -230/@fontSize;
      width: 460/@fontSize;
      height: 100/@fontSize;
      text-align: center;
      color: #fff;
      font-size: 32/@fontSize;
      line-height: 100/@fontSize;
      background: #64a737;
      border-radius: 10/@fontSize;
    }
  }
</style>

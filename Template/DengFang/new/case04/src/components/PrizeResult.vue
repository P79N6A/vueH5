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
        this.$emit('child-say', true);
      },
    }
  }
</script>
<style lang="less" scoped>
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
      bottom: 5.7rem;
      left: 0;
      z-index: 102;
      width: 100%;
      height: 22rem;
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
          font-size: 1.2rem;
          margin-bottom: 1.4rem;
        }
        .prize-result-describe {
          position: relative;
          margin: 0 auto;
          width: 12rem;
          height: 13.25rem;
          color: #e8000d;
          font-size: .8rem;
          font-weight: 700;
          .prize-result-details {
            position: relative;
            margin: 1rem 0;
            padding: .5rem 0;
            box-sizing: border-box;
            height: 7rem;
            font-size: 0;
            text-align: left;
            background: #cb2925;
            border: .5rem solid #e8000d;
            .coupons-image {
              display: inline-block;
              vertical-align: middle;
              margin: .5rem .4rem;
              width: 4rem;
              height: 4rem;
              background-size: cover;
            }
            .coupons-title {
              position: absolute;
              right: 0;
              top: .5rem;
              width: 6.2rem;
              height: 5rem;
              font-size: .8rem;
              color: #fff;
              text-align: center;
              border-left: 1px solid #fff;
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
            height: 2rem;
            text-align: center;
            color: #fff;
            font-size: .8rem;
            line-height: 2rem;
            background: #e8000d;
            border-radius: 3px;
          }
        }
      }
    }
    .again {
      position: absolute;
      left: 50%;
      bottom: 2.75rem;
      z-index: 102;
      margin-left: -5.75rem;
      width: 11.5rem;
      height: 2.5rem;
      text-align: center;
      color: #fff;
      font-size: .8rem;
      line-height: 2.5rem;
      background: #64a737;
      border-radius: 5px;
    }
  }
</style>

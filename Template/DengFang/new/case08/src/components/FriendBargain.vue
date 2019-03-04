<template>
  <section id="bargain" :style='{backgroundImage:"url("+images.bargain_bg+")"}'>
    <div class="bargain-prize" :style='{backgroundImage:"url("+prizeImg+")"}'></div>
    <div class="bargain-progress">
      <div class="original-price">
        <p>原价</p>
        <p>￥<span v-html="details.originalPrices"></span></p>
      </div>
      <div class="progress" v-if="!bargainEnd">
        <div class="progress-child"></div>
      </div>
      <div class="progress-end" v-if="bargainEnd">
        <div class="progress-end-child">
          <span>砍价已完成</span>
        </div>
      </div>
      <div class="target">
        <p>目标</p>
        <p>￥<span v-html="details.targetPrices"></span></p>
      </div>
    </div>
    <p class="bargain-progress-text">
      已经砍价 <span v-html="details.cutPrices"></span> 元，还要砍 <span
      v-html="details.originalPrices - details.cutPrices"></span> 元
    </p>
    <div class="friends">
      <div class="friend" v-for="helper of details.helperList" :key="helper.name">
        <div class="friend-headImage" :style='{backgroundImage:"url("+helper.headImage+")"}'></div>
        <div class="friend-content">
          <p class="friend-content-text"><span v-html="helper.name"></span> 帮忙砍了</p>
          <p class="friend-content-time" v-html="helper.dateTime"></p>
        </div>
        <div class="friend-bargain"><span v-html="helper.prices"></span>元</div>
      </div>
    </div>
    <div class="try" @click="tryTodo">
      <span>我也试试</span>
    </div>
  </section>
</template>
<script>
  export default {
    props: ['bargainInfo'],
    data() {
      return {
        //---------------模板链接数据 end-------------
        config: {},
        images: {},
        fontSize: 0,
        bargainEnd: false,
        oldPrice: 100,
        targetPrice: 0,
        prizeImg: '',
        details: {},
        friendHelp: [],
        status: '',
      }
    },
    created(){      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      // 获取当前屏幕下默认的html大小，用于绘制canvas大小
      this.fontSize = parseFloat(window.getComputedStyle(document.querySelector("html")).fontSize);
      this.setConfig();
    },

    methods: {
      setConfig(){
        let config = sessionStorage.getItem('config');
        config = JSON.parse(decodeURI(config));
        let details = sessionStorage.getItem('friendDetails');
        details = JSON.parse(decodeURI(details));
        this.config = config;
        this.images = this.config.images;
        this.details = details;
        for (let i of this.images.prize_img_box) {
          if (details.item_id == i.item_id) {
            this.prizeImg = i.prize_img;
          }
        }
        this.bargainEnd = details.status != 'DOING';
        if (!this.bargainEnd) {
          const self = this;
          setTimeout(function () {
            self.setWidth();
          }, 10);
        }
      },
      setWidth(){
        this.scale = 11 / (this.details.originalPrices - this.details.targetPrices);
        const w = this.scale * this.details.cutPrices;
        $('.progress-child').css({
          'width': w + 'rem',
          'transition': 'width 1s'
        });
      },

      tryTodo(){
        this.$emit('friendTty', true);
      }
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
      .progress {
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
          background: -webkit-gradient(linear, 0 0, 0 bottom, from(gold), to(gold), color-stop(40%, #FCFF58), color-stop(60%, #FCFF58));
          border-radius: .9rem;
        }
      }
      .progress-end {
        display: inline-block;
        vertical-align: middle;
        margin: 0 .3rem;
        width: 11rem;
        height: 1.8rem;
        border: 2px solid gold;
        border-radius: .9rem;
        box-shadow: 0 0 1rem rgba(255, 255, 0, .8);
        .progress-end-child {
          margin: .1rem;
          height: 1.6rem;
          border-radius: .9rem;
          font-size: .8rem;
          color: #fff;
          line-height: 1.6rem;
          background: #ffd400;
        }
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
      bottom: 7.5rem;
      -webkit-transform: translateX(-7.875rem);
      transform: translateX(-7.875rem);
      width: 15.75rem;
      height: 3.5rem;
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
    .try {
      position: absolute;
      left: 50%;
      bottom: 2.25rem;
      -webkit-transform: translateX(-5.625rem);
      transform: translateX(-5.625rem);
      width: 11.25rem;
      height: 1.75rem;
      font-size: .7rem;
      color: #fff;
      background: #64a737;
      text-align: center;
      line-height: 1.75rem;

    }

  }
</style>

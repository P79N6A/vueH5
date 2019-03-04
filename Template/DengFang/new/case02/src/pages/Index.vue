<template>
  <section id="template">
    <!--加载loading-->
    <div class="loading" v-if="inLoading">
      <img src="../assets/loading-bars.svg">
    </div>
    <!--背景图片-->
    <img class="bg-image" :src="images.bg_image" alt="">
    <!--音乐播放/暂停按钮-->
    <div class="music-image" :class='inPlay?"music-active":""' :style='{backgroundImage:"url("+images.music_image+")"}'
         @click="playMusic"></div>
    <!--音乐播放-->
    <audio loop="loop" id="audio" :src="music"></audio>
    <!--锦囊按钮-->
    <div class="silk-bag-image" :style='{backgroundImage:"url("+images.silk_bag_image+")"}' @click="showSilkBag"></div>
    <!--模板组件内修改-->
    <div class="prize-area">
      <!--奖盘背景 用于灯光闪烁-->
      <div class="prize-area-bg-up" v-if="prizeAreaBgActive"></div>
      <div class="prize-area-bg" v-if="!prizeAreaBgActive"></div>
      <!--奖盘背景-->
      <!--奖盘-->
      <div class="prize-arr">
        <!--奖项 通过循环得到每一个奖项内容， 通过奖项标识匹配相应的图片   -->
        <div class="prize-parent" v-for="item of sequence" :key="item.item_id">
          <div :style='{backgroundImage:"url("+item.prize_img+")"}' v-if="item !== -1"></div>
          <div class="prize-draw" :style='{backgroundImage:"url("+images.prize_draw+")"}' v-if="item === -1"
               @click="draw"></div>
        </div>
        <!--奖盘 mask ,抽奖时出现-->
        <div class="prize-mask" v-if="inPrizeDraw"></div>
      </div>
    </div>
    <!--剩余抽奖次数-->
    <div class="prize-draw-number-text" v-html="prizeDrawNumberText"></div>
    <!--锦囊组件 点击锦囊按钮出现-->
    <SilkBag v-if="hasShowSilkBag" v-on:child-say="hideSilkBag"></SilkBag>
    <!--开奖结果组件 抽奖完成出现-->
    <PrizeResult :prizeInfo="prizeInfo" v-if="showPrizeResult" v-on:child-say="tryAgain"></PrizeResult>
    <Loading v-if="loading"></Loading>
  </section>
</template>
<script>
  //引入锦囊组件
  import SilkBag from "../components/SilkBag.vue";
  //引入开奖结果组件
  import PrizeResult from "../components/PrizeResult.vue";
  import Loading from '../components/Loading.vue';
  import {authorize} from '../services/authorize';
  import {getcoupon} from "../services/getcoupon";
  //引入json文件
  import{getConfig} from '../services/getConfig';
  export default {
    //注册引入的组件
    components: {
      SilkBag,
      Loading,
      PrizeResult
    },
    data() {
      //声明需要的属性
      return {
        // ---------------------共用属性 用于公共模板-----------------------
        xjjOpenId: '',
        openId: '',
        activityId: '',
        from: '',
        storeCode: '',
        //---------------模板链接数据 end-------------
        config: {},
        loading: false,
        inLoading: true, //加载状态
        images: {}, //图片集--用作图片展示
        imageArr: [],//图片集--用作判断图片加载状态
        music: '', //音乐地址
        inPlay: false, //是否在播放音乐
        oImage: new Image(), //图片对象，用作加载图片
        iCur: 0, //图片加载的序号
        hasShowSilkBag: false, //锦囊
        showPrizeResult: false, //抽奖结果
        inPrizeDraw: false, //是否处于抽奖状态
        hasGetPrize: false, // 当前轮数是否已抽奖
        prizeDrawNumberText: '', //抽奖次数提示语
        prizeDrawNumber: 5, //默认抽奖次数
        prize: -1, //默认奖品
        prizeInfo: {},
        // ---------------------私有属性  用于当前模板-----------------------
        prizeAreaBgActive: false, //奖盘背景动画状态
        sequence: [],//奖品序列
        speed: 100, //初始转到速度
        timeNumber: 0, //转动的总时长
        showArr: [0, 1, 2, 5, 8, 7, 6, 3], //奖盘排列序号
        animationIndex: 0, //当前展示动画的序号
        timer: 0, //动画声明
        prizeIndex: -1
      }
    },

    created(){
      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      document.querySelector("body").addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      // 获取链接参数
      this.xjjOpenId = this.$route.query.xjj_openId;
      this.openId = this.$route.query.openid;
      this.activityId = this.$route.query.activity_id;
      this.from = this.$route.query.from;
      this.storeCode = this.$route.query.store_code;
      // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
      if (this.xjjOpenId !== "" && typeof this.xjjOpenId !== 'undefined' && this.xjjOpenId !== null) {
        this.start();
      } else {
        authorize(this.openId, this.activityId, this.from, this.storeCode);
      }
    },
    watch: {
      '$route': 'checkedRouter'
    },
    methods: {
      checkedRouter(){
        this.xjjOpenId = this.$route.query.xjj_openId;
        // 链接是否带有 xjjOpenId ？ 直接进入start ： 授权
        if (this.xjjOpenId !== "" && typeof this.xjjOpenId !== 'undefined' && this.xjjOpenId !== null) {
          this.start();
        } else {
          authorize(this.openId, this.activityId, this.from, this.storeCode);
        }
      },
      start(){
        getConfig(res => {
          this.config = res;
          this.music = this.config.music;
          // 组合模板图片地址进行预加载
          for (let item in  this.config.images) {
            if (item === 'prize_img_box') {
              for (let p of this.config.images[item]) {
                this.imageArr.push(p.prize_img);
              }
            } else {
              this.imageArr.push(this.config.images[item]);
            }
          }
          const prizeDrawNumberText = this.config.tooltips.prize_draw_number;
          this.prizeDrawNumberText = prizeDrawNumberText.replace("{n}",
            '<span style="color: #fff"> ' + this.prizeDrawNumber + ' </span>');
          // 图片加载完成后进行赋值处理
          this.loadImages((back) => {
            this.images = this.config.images;
            this.inLoading = false;
            // 获取奖项序列，并插入开始抽奖按钮
            const oldSequence = this.config.images.prize_img_box;
            oldSequence.splice(4, 0, -1);
            this.sequence = oldSequence;
            //执行奖盘背景灯光
            this.prizeAreaBgAnimation();
          });
        });
      },
      loadImages(callback){
        // 加载图片
        const self = this;
        let oImage = new Image();
        oImage.src = this.imageArr[this.iCur];
        oImage.onload = function () {
          self.iCur++;
          if (self.iCur < self.imageArr.length) {
            self.loadImages(callback);
          } else {
            callback(1);
          }
        };
      },
      prizeAreaBgAnimation(){
        //改变奖盘背景状态
        this.prizeAreaBgActive = !this.prizeAreaBgActive;
        setTimeout(this.prizeAreaBgAnimation, 250);
      },

      playMusic(){
        //播放暂停音乐
        this.inPlay = !this.inPlay;
        const music = document.getElementById("audio");
        if (this.inPlay) {
          music.play();
        } else {
          music.pause();
        }
      },

      draw(){       //抽奖
        const self = this;
        if (this.inPrizeDraw) {
          return false;
        }
        if (this.prizeDrawNumber <= 0) {
          alert("您今天的抽奖次数用完啦! ");
          return false;
        }
        // 获取奖项
        if (!this.hasGetPrize) {
          this.hasGetPrize = true;
          this.loading = true;
          setTimeout(function () {
            const prizeBack = getcoupon(self.openId, self.activityId, self.xjjOpenId, 'jushuhui', self.config.host);
            self.loading = false;
            if (prizeBack.return_code != '200') {
              alert(prizeBack.return_msg);
              self.tryAgain();
            } else {
              self.prizeInfo = prizeBack;
              let prizeArr = [];
              const prizeId = parseInt(prizeBack.item_id);
              for (let index in self.sequence) {
                if (self.sequence[index].item_id === prizeId) {
                  prizeArr.push(index);
                }
              }
              self.prize = Math.random() > 0.5 ? parseInt(prizeArr[1]) : parseInt(prizeArr[0]);
              self.prizeDrawNumber--;
              const prizeDrawNumberText = self.config.tooltips.prize_draw_number;
              self.prizeDrawNumberText = prizeDrawNumberText.replace("{n}", '<span style="color: #fff"> ' +
                self.prizeDrawNumber + ' </span>');
              self.inPrizeDraw = true;
              self.prizeAnimation();
            }
          }, 50);
        }
      },

      prizeAnimation(){
        //抽奖动画 通过添加删除class 来改变当前显示奖项的样式
        const self = this;
        if (this.animationIndex >= 8) {
          this.animationIndex = 0;
          $(".prize-parent").removeClass("prize-active");
        }
        $(".prize-parent").eq(this.showArr[this.animationIndex]).addClass("prize-active");
        $(".prize-parent").eq(this.showArr[this.animationIndex - 1]).removeClass("prize-active");
        //当动画时间执行大于2000毫秒时减小转动速度。
        if (this.timeNumber > 2000 && this.timeNumber <= 3500) {
          this.speed += 50;
        }
        if (this.timeNumber > 3500 && this.prize !== -1 && this.prize === this.showArr[this.animationIndex]) {
          clearTimeout(this.timer);
          this.timer = 0;
          setTimeout(function () {
            self.showPrizeResult = true;
          }, 800);
          return false;
        }
        this.animationIndex++;
        this.timeNumber += this.speed;
        this.timer = setTimeout(this.prizeAnimation, this.speed);
      },

      tryAgain(callback){
        //再来一次 重置已改变的属性的值
        this.showPrizeResult = false;
        this.animationIndex = 0;
        this.speed = 100;
        this.timeNumber = 0;
        this.inPrizeDraw = false;
        this.prize = -1;
        this.hasGetPrize = false;
        $(".prize-parent").removeClass("prize-active");
      },
      hideSilkBag(){
        //关闭锦囊
        this.hasShowSilkBag = false;
      },
      showSilkBag(){
        // 打开锦囊
        if (!this.inPrizeDraw) {
          this.hasShowSilkBag = true;
        }
      }
    }
  };
</script>
<style scoped lang="less">
  @import "index";
</style>

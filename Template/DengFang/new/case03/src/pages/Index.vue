<template>
  <section id="template">
    <div class="loading" v-if="inLoading">
      <img src="../assets/loading-bars.svg">
    </div>
    <img class="bg-image" :src="images.bg_image" alt="">
    <!--音乐播放/暂停按钮-->
    <div class="music-image" :class='inPlay?"music-active":""' :style='{backgroundImage:"url("+images.music_image+")"}'
         @click="playMusic"></div>
    <!--音乐播放器-->
    <audio loop="loop" id="audio" :src="music"></audio>
    <!--锦囊按钮-->
    <div class="silk-bag-icon" :style='{backgroundImage:"url("+images.silk_bag_image+")"}'
         @click="showSilkBag"></div>
    <!--模板私有内容 -->
    <div class="prize-area">
      <!--抽奖圆盘-->
      <canvas id="prizeDisc"></canvas>
      <!--抽奖按钮-->
      <div class="to-prize-draw" :style="{backgroundImage:'url('+images.prize_draw+')'}" @touchstart="draw"></div>
    </div>
    <!--剩余抽奖次数 -->
    <div class="prize-draw-number-text" v-html="prizeDrawNumberText"></div>
    <!--锦囊组件-->
    <SilkBag v-if="hasShowSilkBag" v-on:child-say="hideSilkBag"></SilkBag>
    <!--开奖结果组件-->
    <PrizeResult :prizeInfo="prizeInfo" v-if="hasShowPrizeResult" v-on:child-say="tryAgain"></PrizeResult>
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
      PrizeResult,
      Loading
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
        images: {}, //图片集--用作图片展示
        imageArr: [],//图片集--用作判断图片加载状态
        iCur: 0, //图片加载的序号
        music: '', //音乐地址
        inPlay: false, //是否在播放音乐
        hasShowSilkBag: false, //是否展示锦囊
        hasShowPrizeResult: false, //是否展示抽奖结果
        inDraw: false, //是否处于抽奖状态
        hasGetPrize: false, // 当前轮数是否已抽奖
        prizeDrawNumberText: '', //抽奖次数提示语
        prizeDrawNumber: 5, //默认抽奖次数
        prize: -1, //默认奖品
        prizeInfo: {},
        // ---------------------私有属性-----------------------
        showArr: [210, 270, 330, 390, 450, 510], //奖盘排列序号,
        imagesArr: [],//画布需要的奖品icon对象，用于预加载图片
        fontSize: 0 //当前屏幕下字体大小
      }
    },
    created(){      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      document.querySelector("body").addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      // 获取当前屏幕下默认的html大小，用于绘制canvas大小
      this.fontSize = parseFloat(window.getComputedStyle(document.querySelector("html")).fontSize);
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
        authorize(this.activityId, this.openId, this.from, this.storeCode);
        this.start();
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
          authorize(this.activityId, this.openId, this.from, this.storeCode);
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
                key: -1,
                val: this.config.images[item]
              });
            }
          }
          const prizeDrawNumberText = this.config.tooltips.prize_draw_number;
          this.prizeDrawNumberText = prizeDrawNumberText.replace("{n}",
            '<span style="color: #fff"> ' + this.prizeDrawNumber + ' </span>');
          // 图片加载完成后进行赋值处理
          this.loadImages((back) => {
            this.images = this.config.images;
            this.inLoading = false;
            this.createdCtx();
          });
        });
      },

      loadImages(callback){        // 加载图片
        const self = this;
        let oImage = new Image();
        oImage.src = this.imageArr[this.iCur].val;
        oImage.onload = function () {
          const item = self.imageArr[self.iCur];
          if (item.key === 'prize_img') {
            self.imagesArr.push({
              id: item.id,
              img: oImage
            });
          }
          self.iCur++;
          if (self.iCur < self.imageArr.length) {
            self.loadImages(callback);
          } else {
            callback(1);
          }
        };
      },

      createdCtx(){        //画奖盘
        const self = this;
        const prizeDisc = document.getElementById('prizeDisc');
        const canvasW = 18 * this.fontSize;
        const canvasH = 18 * this.fontSize;
        //设置canvas大小
        prizeDisc.setAttribute('width', canvasW);
        prizeDisc.setAttribute('height', canvasH);
        if (prizeDisc) {
          const ctx = prizeDisc.getContext("2d");
          ctx.beginPath();
          let startAngle = 0;//扇形的开始弧度
          let endAngle = 0;//扇形的终止弧度
          //奖盘背景色
          const color = ["#fff9c7", "#ffea7e"];
          //画一个6等份扇形组成的圆形
          for (let i = 0; i < 6; i++) {
            startAngle = Math.PI * (i / 3 - 1 / 6);
            endAngle = startAngle + Math.PI * (1 / 3);
            ctx.save();
            ctx.beginPath();
            //canvas 绘制圆(圆心坐标X, 圆心坐标Y, 半径, 起始角度, 结束角度, 绘制方向)
            ctx.arc(canvasW / 2, canvasH / 2, canvasW / 2, startAngle, endAngle, false);
            ctx.lineWidth = canvasW;
            if (i % 2 === 0) {
              ctx.strokeStyle = color[0];
            } else {
              ctx.strokeStyle = color[1];
            }
            ctx.stroke();
            ctx.restore();
          }
          // 插入奖项对应的图片
          const step = Math.PI / 3;
          for (let i = 0; i < 6; i++) {
            const img = self.imagesArr[i].img;
            ctx.save();
            ctx.beginPath();
            ctx.translate(canvasW / 2, canvasH / 2);
            ctx.rotate(Math.PI + (i * step + Math.PI / 6));
            //添加图片至画布(图片, 在画布上放置的坐标X, 在画布上放置的坐标Y, 大小, 高宽)
            ctx.drawImage(img, -2 * self.fontSize, -8 * self.fontSize, 4 * self.fontSize, 4 * self.fontSize);
            ctx.closePath();
            ctx.restore();
          }
        }
      },

      draw(){        // 获取奖项结果
        const self = this;
        if (this.inDraw) {
          return false;
        }
        if (this.prizeDrawNumber <= 0) {
          alert('您今天的抽奖次数用完啦!');
          return false;
        }
        if (!this.hasGetPrize) {
          this.hasGetPrize = true;
          this.loading = true;
          setTimeout(function () {
            const prizeBack = getcoupon(self.openId, self.activityId, self.xjjOpenId, 'third_name', self.config.host);
            self.loading = false;
            if (prizeBack.return_code !== '200') {
              alert('获取数据失败！');
              self.tryAgain();
            } else {
              self.prizeInfo = prizeBack;
              let prizeArr = [];
              const prizeId = parseInt(prizeBack.item_id);
              for (let index in self.imagesArr) {
                if (self.imagesArr[index].id === prizeId) {
                  prizeArr.push(index);
                }
              }
              self.prize = Math.random() > 0.5 ? parseInt(prizeArr[1]) : parseInt(prizeArr[0]);
              self.prizeDrawNumber--;
              const prizeDrawNumberText = self.config.tooltips.prize_draw_number;
              self.prizeDrawNumberText = prizeDrawNumberText.replace("{n}", '<span style="color: #fff"> '
                + self.prizeDrawNumber + ' </span>');
              self.inDraw = true;
              self.drawAction();
            }
          }, 50);
        }
      },
      drawAction(){
        const self = this;
        const rand_circle = Math.ceil(Math.random() * 3) + 4;
        const rotate_angle = rand_circle * 360 - this.showArr[this.prize];
        $('#prizeDisc').css({
          '-webkit-transform': 'rotate(' + rotate_angle + 'deg)',
          'transform': 'rotate(' + rotate_angle + 'deg)',
          '-webkit-transition': 'transform 3s',
          'transition': 'transform 3s',
        });

        setTimeout(function () {
          self.hasShowPrizeResult = true;
        }, 3800);
      },
      tryAgain(callback){        //再来一次
        $('#prizeDisc').css({
          '-webkit-transform': 'rotate(150deg)',
          'transform': 'rotate(150deg)',
          '-webkit-transition': 'transform 0s',
          'transition': 'transform 0s',
        });
        this.hasShowPrizeResult = false;
        this.inDraw = false;
        this.prize = -1;
        this.hasGetPrize = false;
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
    }
  };
</script>
<style scoped lang='less'>
  @import 'index';
</style>

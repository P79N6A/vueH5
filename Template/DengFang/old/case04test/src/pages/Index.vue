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
      <div class="prize-hammer" :style='{backgroundImage:"url("+images.prize_draw+")"}'></div>

      <div class="prize prize-first"
           @click="draw('prize-first')" :style='{backgroundImage:"url("+intactEggs+")"}'>
      </div>
      <div class="prize prize-second" :style='{backgroundImage:"url("+intactEggs+")"}'
           @click="draw('prize-second')"></div>
      <div class="prize prize-third" :style='{backgroundImage:"url("+intactEggs+")"}'
           @click="draw('prize-third')"></div>
    </div>
    <!--剩余抽奖次数 -->
    <div class="prize-draw-number-text" v-html="prizeDrawNumberText"></div>
    <!--锦囊组件-->
    <SilkBag v-if="hasShowSilkBag" v-on:child-say="hideSilkBag"></SilkBag>
    <!--开奖结果组件-->
    <PrizeResult :prizeInfo="prizeInfo" v-if="hasShowPrizeResult" v-on:child-say="tryAgain"></PrizeResult>
  </section>
</template>
<script>
  //引入锦囊组件
  import SilkBag from "../components/SilkBag.vue";
  //引入开奖结果组件
  import PrizeResult from "../components/PrizeResult.vue";
  import {authorize} from '../services/authorize';
  import {getcoupon} from "../services/getcoupon";
  //引入json文件
  const config = require('../../static/data/config.json');
  export default {
    //注册引入的组件
    components: {
      SilkBag,
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
        inLoading: true, //加载状态
        images: {}, //图片集--用作图片展示
        imageArr: [],//图片集--用作判断图片加载状态
        iCur: 0, //图片加载的序号
        music: '', //音乐地址
        inPlay: false, //是否在播放音乐
        hasShowSilkBag: false, //是否展示锦囊
        sequence: [],//奖品序列
        hasShowPrizeResult: false, //是否展示抽奖结果
        inDraw: false, //是否处于抽奖状态
        hasGetPrize: false, // 当前轮数是否已抽奖
        prizeDrawNumberText: '', //抽奖次数提示语
        prizeDrawNumber: 500, //默认抽奖次数
        prize: -1, //默认奖品
        prizeInfo: {},
        // ---------------------私有属性-----------------------
        intactEggs: '', //完好的金蛋图片地址
        chappedEggs: '', //裂开的金蛋的图片地址
        fontSize: 0, //当前屏幕下字体大小
        timer: 0, //时间
        coordinate: [], //坐标
      }
    },
    created(){      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      this.music = config.music;
      document.querySelector("body").addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      // 获取当前屏幕下默认的html大小，用于绘制金蛋运行轨迹
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
        authorize(this.openId, this.activityId, this.from, this.storeCode);
//        this.start();
      }
    },
    methods: {
      start(){ // 模板执行入口方法
        // 组合模板图片地址进行预加载
        for (let item in  config.images) {
          if (item === 'prize_img_box') {
            for (let p of config.images[item]) {
              this.imageArr.push(p.prize_img);
              if (p.type === 'intact_eggs') {
                this.intactEggs = p.prize_img;
              }
              if (p.type === 'chapped_eggs') {
                this.chappedEggs = p.prize_img;
              }
            }
          } else {
            this.imageArr.push(config.images[item]);
          }
        }
        const prizeDrawNumberText = config.tooltips.prize_draw_number;
        this.prizeDrawNumberText = prizeDrawNumberText.replace("{n}", '<span style="color: #fff"> '
          + this.prizeDrawNumber + ' </span>');
        // 图片加载完成后进行赋值处理
        this.loadImages((back) => {
          this.images = config.images;
          this.inLoading = false;
          this.createdPrize();
        });
      },

      loadImages(callback){        // 加载图片
        const self = this;
        const arr = Object.keys(this.imageArr);
        let oImage = new Image();
        oImage.src = this.imageArr[arr[this.iCur]];
        oImage.onload = function () {
          self.iCur++;
          if (self.iCur < arr.length) {
            self.loadImages(callback);
          } else {
            callback(1);
          }
        };
      },

      createdPrize(){
        //x,y 圆心坐标 , a 椭圆长半轴，b 椭圆半短轴，arr 椭圆上的点对应的坐标集
        const prizeParentW = $('.prize-area').width();
        const prizeParentH = $('.prize-area').height();
        const prizeW = $('.prize').width();
        const prizeH = $('.prize').height();
        const w = prizeW;
        const h = prizeH;
        const x = prizeParentW / 2;
        const y = prizeParentH / 2;
        const a = prizeParentW / 2 - prizeW / 2;
        const b = prizeParentH / 2;
        const degree = 360;
        const arr = [];
        for (let i = 0; i < degree; i++) {
          const hudegree = (Math.PI / 180) * i;
          const x1 = a * Math.sin(hudegree) + x;
          const y1 = y - (b * Math.cos(hudegree));
          arr[i] = [];
          arr[i].x = x1 - w / 2;
          arr[i].y = y1 - h;
        }
        this.coordinate = arr;
        this.prizeInit();
        this.action();
      },
      //初始化点位置 0，120，240
      prizeInit(){
        const arr = this.coordinate;
        $('.prize-first').css({
          '-webkit-transform': 'translate3d(' + arr[0].x + 'px,' + arr[0].y + 'px,0)',
          'transform': 'translate3d(' + arr[0].x + 'px,' + arr[0].y + 'px,0)',
          'display': 'block',
          'z-index': '0'
        });
        $('.prize-second').css({
          '-webkit-transform': 'translate3d(' + arr[120].x + 'px,' + arr[120].y + 'px,0)',
          'transform': 'translate3d(' + arr[120].x + 'px,' + arr[120].y + 'px,0)',
          'display': 'block',
          'z-index': '0'
        });
        $('.prize-third').css({
          '-webkit-transform': 'translate3d(' + arr[240].x + 'px,' + arr[240].y + 'px,0)',
          'transform': 'translate3d(' + arr[240].x + 'px,' + arr[240].y + 'px,0)',
          'display': 'block',
          'z-index': '0'
        });

      },

      action(){
        const arr = this.coordinate;
        const degree = 360;
        let z = 0, m = 120, n = 240;
        clearInterval(this.timer);
        this.timer = setInterval(function () {
          // 第一个金蛋运动轨迹
          if (z >= degree) {
            z = 0
          }
          $('.prize-first').css({
            '-webkit-transform': 'translate3d(' + arr[z].x + 'px,' + arr[z].y + 'px,0)',
            'transform': 'translate3d(' + arr[z].x + 'px,' + arr[z].y + 'px,0)',
          });
          if (z <= 90 || z >= 270) {
            $('.prize-first').css({
              'z-index': '0'
            });
          } else {
            $('.prize-first').css({
              'z-index': '10'
            });
          }
          z++;

          // 第二个金蛋运动轨迹
          if (m >= degree) {
            m = 0
          }
          $('.prize-second').css({
            '-webkit-transform': 'translate3d(' + arr[m].x + 'px,' + arr[m].y + 'px,0)',
            'transform': 'translate3d(' + arr[m].x + 'px,' + arr[m].y + 'px,0)',
          });
          if (m <= 90 || m >= 270) {
            $('.prize-second').css({
              'z-index': '0'
            });
          } else {
            $('.prize-second').css({
              'z-index': '10'
            });
          }
          m++;

          // 第三个金蛋运动轨迹
          if (n >= degree) {
            n = 0
          }
          $('.prize-third').css({
            '-webkit-transform': 'translate3d(' + arr[n].x + 'px,' + arr[n].y + 'px,0)',
            'transform': 'translate3d(' + arr[n].x + 'px,' + arr[n].y + 'px,0)',
          });
          if (n <= 90 || n >= 270) {
            $('.prize-third').css({
              'z-index': '0'
            });
          } else {
            $('.prize-third').css({
              'z-index': '10'
            });
          }
          n++;
          $('.prize').addClass('prize-action');
        }, 30);
      },


      draw(item){      //抽奖
        const self = this;
        if (this.inDraw) {
          return false;
        }
        if (this.prizeDrawNumber <= 0) {
          alert('您今天的抽奖次数用完啦!');
          return false;
        }
        this.prizeDrawNumber--;
        const prizeDrawNumberText = config.tooltips.prize_draw_number;
        this.prizeDrawNumberText = prizeDrawNumberText.replace("{n}", '<span style="color: #fff"> '
          + this.prizeDrawNumber + ' </span>');
        this.inDraw = true;
        clearInterval(this.timer);

        if (!this.hasGetPrize) {
          this.hasGetPrize = true;
          //获取点击目标的位置，
          const matrix = $('.' + item).css('transform').split(',');
          $('.prize-hammer').css({
            'left': parseInt(matrix[4]) + $('.prize').width() / 2 + 'px',
            'top': parseInt(matrix[5]) - $('.prize-hammer').height() + 'px',
          });
          $('.prize-hammer').addClass('prize-hammer-action');
          $('.prize').removeClass('prize-action');
          const couponBack = getcoupon(this.openId, this.activityId, this.xjjOpenId, 'third_name');
          if (couponBack.return_code != '200') {
            alert('获取数据失败！');
            this.tryAgain();
          } else {
            this.prizeInfo = couponBack;
            setTimeout(function () {
              $('.' + item).css({
                'background-image': "url(" + self.chappedEggs + ")"
              });
            }, 550);
            setTimeout(function () {
              self.hasShowPrizeResult = true;
              $('.' + item).css({
                'background-image': "url(" + self.intactEggs + ")"
              });
              $('.prize-hammer').removeClass('prize-hammer-action');
              self.prizeInit();
            }, 1000);

          }
        }
      },


      tryAgain(callback){        //再来一次
        this.hasShowPrizeResult = false;
        this.inDraw = false;
        this.prize = -1;
        this.hasGetPrize = false;

        this.prizeInit();
        this.action();
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

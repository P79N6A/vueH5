<template>
  <section id="template">
    <div class="loading" v-if="inLoading">
      <img src="../assets/loading-bars.svg">
    </div>
    <!--音乐播放/暂停按钮-->
    <div class="music-image" :class='inPlay?"music-active":""' :style='{backgroundImage:"url("+images.music_image+")"}'
         @click="playMusic"></div>
    <!--音乐播放器-->
    <audio loop="loop" id="audio" :src="music"></audio>
    <!--锦囊按钮-->
    <div class="silk-bag-icon" :style='{backgroundImage:"url("+images.silk_bag_image+")"}'
         @click="showSilkBag"></div>
    <!--模板私有内容 -->
    <div class="panorama">
      <div class="panorama-parent" @touchstart="startMove" @touchmove="movePanorama"
           @touchend="endMove">
        <div class="panorama-image">
          <!--<img :src='panoramaImage.src'/>-->
          <div id="grid" class="main">
            <div class="view">
              <img :src='panoramaImage.src'/>
            </div>
          </div>
        </div>
        <div class="panorama-bubble" v-for="item of bubbleArr" :key="item.item_id"
             :style='{backgroundImage:"url("+item.val+")"}' @click="draw(item)"></div>
      </div>
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
        prizeDrawNumber: 5, //默认抽奖次数
        prize: -1, //默认奖品
        prizeInfo: {},
        // ---------------------私有属性-----------------------
        fontSize: 0, //当前屏幕下字体大小
        pageX: 0,
        translateNumber: 0,
        hasEndTouch: true,
        panoramaImage: {},
        scale: 0,
        bubbleArr: [],
        hasDefaultMove: true,
      }
    },
    created(){      //生命钩子 -- 组件实例创建完成，属性已绑定，还为生成DOM
      document.querySelector("body").addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      // 获取当前屏幕下默认的html大小，用于绘制canvas大小
      this.fontSize = parseFloat(window.getComputedStyle(document.querySelector("html")).fontSize);
      this.checkedRouter();
    },
    watch: {
      '$route': 'checkedRouter'
    },
    methods: {
      checkedRouter(){
        //获取路由上的参数
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
        }
      },
      start(){ // 模板执行入口方法
        getConfig(res => {
          this.config = res;
          this.music = this.config.music;
          // 组合模板图片地址进行预加载
          for (let item in  this.config.images) {
            if (item === 'bubble_img_box') {
              for (let p of this.config.images[item]) {
                this.imageArr.push({
                  id: p.item_id,
                  key: 'bubble',
                  val: p.link,
                  x: p.x,
                  y: p.y
                });
              }
            } else if (item !== 'bg_image_width') {
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
            const self = this;
            setTimeout(function () {
              self.createdImg();
            }, 50);
          });
        });
      },
      loadImages(callback){        // 加载图片
        const self = this;
        let oImage = new Image();
        const item = this.imageArr[this.iCur];
        oImage.src = item.val;
        oImage.onload = function () {
          if (item.key === 'bg_image') {
            self.panoramaImage = oImage;
          }
          if (item.key === 'bubble') {
            self.bubbleArr.push(item);
          }
          self.iCur++;
          if (self.iCur < self.imageArr.length) {
            self.loadImages(callback);
          } else {
            callback(1);
          }
        };
      },
      createdImg(){
        const self = this;
        Modernizr.load({
          test: Modernizr.csstransforms3d && Modernizr.csstransitions,
          yep: ['http://libs.baidu.com/jquery/2.1.4/jquery.min.js', './static/3D_js/jquery.hoverfold.js'],
          nope: 'css/fallback.css',
          callback: function (url, result, key) {
            if (url === './static/3D_js/jquery.hoverfold.js') {
              $('#grid').hoverfold();
              self.inLoading = false;

            }

            /*setTimeout(function () {
             $('.view .s1').css({
             '-webkit-transform': 'translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)',
             'transform': 'translate3d(0, 0, 0) rotate3d(0, 1, 0, -0deg)'
             })
             $('.view .s2').css({
             '-webkit-transform': 'translate3d(3.75rem, 0, 0) rotate3d(0, 1, 0, 0deg)',
             'transform': 'translate3d(3.75rem, 0, 0) rotate3d(0, 1, 0, 0deg)'
             })
             $('.view .s3').css({
             '-webkit-transform': 'translate3d(3.75rem, 0, 0) rotate3d(0, 1, 0, 0deg)',
             'transform': 'translate3d(3.75rem, 0, 0) rotate3d(0, 1, 0, 0deg)'
             })
             $('.view .s4').css({
             '-webkit-transform': 'translate3d(3.75rem, 0, 0) rotate3d(0, 1, 0, 0deg)',
             'transform': 'translate3d(3.75rem, 0, 0) rotate3d(0, 1, 0, 0deg)'
             })
             $('.view .s5').css({
             '-webkit-transform': 'translate3d(3.75rem, 0, 0) rotate3d(0, 1, 0, 0deg)',
             'transform': 'translate3d(3.75rem, 0, 0) rotate3d(0, 1, 0, 0deg)'
             })
             }, 20000);*/


          }
        });

      },
      setBubble(){
        const self = this;
        this.scale = $('.panorama').height() / this.panoramaImage.height;
        for (let i in this.bubbleArr) {
          $('.panorama-bubble').eq(i).css({
            left: this.bubbleArr[i].x * this.scale,
            top: this.bubbleArr[i].y * this.scale,
          });
        }
        const maxLeft = ( this.panoramaImage.width * this.scale - $('.panorama').width()) * -1;
        $('.panorama-parent').css({
          'width': this.panoramaImage.width * this.scale + 'px',
          'background': 'url("' + this.panoramaImage.src + '") no-repeat',
          'background-size': 'cover',
        });
        self.hasDefaultMove = false;

      },

      startMove(e){
        if (!this.hasDefaultMove) {
          const t = e.touches[0];
          this.pageX = t.pageX;
        }
      },
      movePanorama(e){
        e.preventDefault();
        if (!this.hasDefaultMove) {
          const t = e.touches[0];
          const maxLeft = ( $('.panorama-parent').width() - $('.panorama').width()) * -1;
          let translateNumber = this.translateNumber + t.pageX - this.pageX;
          if (translateNumber > 0) {
            translateNumber = 0;
          } else if (translateNumber < maxLeft) {
            translateNumber = maxLeft;
          }
          $('.panorama-parent').css({
            '-webkit-transform': 'translate3d(' + translateNumber + 'px,0,0)',
            'transform': 'translate3d(' + translateNumber + 'px,0,0)',
            '-webkit-transition': 'transform 0s',
            'transition': 'transform 0s',
          });
        }
      },
      endMove(){
        if (!this.hasDefaultMove) {
          this.hasEndTouch = true;
          const matrix = $('.panorama-parent').css('transform').split(',');
          this.translateNumber = typeof  matrix[4] === 'undefined' ? 0 : parseInt(matrix[4]);
        }
      },

      draw(item){
        const self = this;
        if (this.inDraw) {
          return false;
        }
        if (!this.hasGetPrize) {
          this.hasGetPrize = true;
          this.loading = true;
          setTimeout(function () {
            //openid, activity_id, xjj_openId, third_party_name,host
            const prizeBack = getcoupon(item.id, self.openId, self.activityId, self.xjjOpenId, 'third_name', self.config.host);
            self.loading = false;
            if (prizeBack.return_code !== '200') {
              alert('获取数据失败！');
              self.tryAgain();
            } else {
              self.prizeInfo = prizeBack;
              self.inDraw = false;
              self.hasShowPrizeResult = true;
            }
          }, 100);
        }
      },
      tryAgain(callback){        //再来一次
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
  @import "../assets/3d/style_common.css";
  @import "../assets/3d/style3.css";
  @import 'index';
</style>

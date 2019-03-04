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
          <div id="main"></div>
        </div>
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
        pano: {},
        rotate: 0
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
          authorize(this.activityId, this.openId, this.from, this.storeCode, friendOpenId, share);
        }
      },
      start(){ // 模板执行入口方法
        getConfig(res => {
          this.config = res;
          $('title').html(this.config.title);
          this.music = this.config.music;
          // 组合模板图片地址进行预加载
          for (let item in  this.config.images) {
            if (item === 'bg_image_box') {
              for (let p in this.config.images[item]) {
                this.imageArr.push({
                  id: '-1',
                  key: 'bg',
                  val: this.config.images[item][p]
                });
              }
            } else if (item === 'bubble_img_box') {
              for (let p of this.config.images[item]) {
                this.imageArr.push({
                  id: p.item_id,
                  key: 'bubble',
                  val: p.link,
                  x: p.x,
                  y: p.y,
                });
              }
            } else if (item !== 'bg_image_style') {
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
            item.hasDraw = false;
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
        //创建场景
        const s = new C3D.Stage();
        s.size(window.innerWidth, window.innerHeight).material({
          color: "#eee"
        }).update();
        document.getElementById('main').appendChild(s.el);
        const w = this.images.bg_image_style.w, h = this.images.bg_image_style.h;
        //创建1个立方体放入场景
        const panoRect = {w: w, h: h};
        const bgData = this.images.bg_image_box;

        function createPano(imgs, rect) {
          const _len = imgs.length;
          const _step = rect.w / _len;
          const _radius = Math.floor(_step / 2 / Math.tan(Math.PI / _len)) - 1; //
          const _sp = new C3D.Sprite();
          for (let i = 0; i < _len; i++) {
            const _p = new C3D.Plane();
            let _r = 360 / _len * i;
            const _a = Math.PI * 2 / _len * i;
            _p.size(_step, rect.h).position(Math.sin(_a) * _radius, 0, -Math.cos(_a) * _radius).rotation(0, -_r, 0).material({
              image: imgs[i],
              repeat: 'no-repeat',
              size: '100%',
              bothsides: false,
            }).update();
            _sp.addChild(_p);
            for (let bubble of self.bubbleArr) {
              if (bubble.x == i && !bubble.hasDraw) {
                const p = new C3D.Plane();
                p.size(_step, _step).position(Math.sin(_a) * (_radius - 50), bubble.y, -Math.cos(_a) * (_radius - 50)).rotation(0, -_r, 0).material({
                  image: bubble.val,
                  repeat: 'no-repeat',
                  size: '100%',
                  bothsides: false,
                }).update();
                _sp.addChild(p);
                p.on("click", function () {
                  self.draw(bubble);
                });
              }
            }
          }
          return _sp;
        }
        this.pano = createPano(bgData, panoRect);
        this.pano.position(0, 0, -500).updateT();
        s.addChild(this.pano);
        //响应屏幕调整尺寸
        function resize() {
          s.size(window.innerWidth, window.innerHeight).update();
        }

        window.onresize = function () {
          resize();
        };
        //刷新场景
        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
        let i = 1;

        function go() {
          i++;
          if (i <= 180) {
            self.pano.rotate(0, 2, 0).updateT();
            requestAnimationFrame(go);
          } else {
            self.hasDefaultMove = false;
          }
        }

        setTimeout(function () {
          self.inLoading = false;
          requestAnimationFrame(go);
        }, 800);
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
          const translateNumber = t.pageX - this.pageX;
          if (translateNumber > this.rotate) {
            this.pano.rotate(0, -3, 0).updateT();
          } else {
            this.pano.rotate(0, 3, 0).updateT();
          }
          this.rotate = translateNumber;
        }
      },
      endMove(){
        if (!this.hasDefaultMove) {
          this.hasEndTouch = true;
          this.rotate = 0;
        }
      },

      draw(item){
        const self = this;
        if (this.inDraw || this.hasDefaultMove) {
          return false;
        }
        if (!this.hasGetPrize) {
          this.hasGetPrize = true;
          this.loading = true;
          setTimeout(function () {
            const prizeBack = getcoupon(item, self.openId, self.activityId, self.xjjOpenId, 'third_name', self.config.host);
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

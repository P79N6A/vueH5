<template>
  <div ref="flipOver"  class="container">
    <div class="title">验证码{{times}}秒后失效</div>
    <div class="flip"  @touchstart="showStatus" @touchend="hiddenStatus">
      <div class="front" :class="auth_code?'frontOut':start?'frontIn':''">
        <img :src="card_image[0]" alt="">
      </div>
      <div class="back" :class="auth_code?'frontIn':start?'frontOut':''">
        <img :src="card_image[1]" alt="">
      </div>
    </div>
    <input type="text" v-model.trim.lazy="code" ref="code" style="font-size: 12pt;" placeholder="验证码">
  </div>
</template>

<script>
  export default {
    props: [
      'prizeImg'
    ],
    data() {
      return {
        //---------------模板链接数据 end-------------
        resultX : 0,
        startX : 0,
        timer : 0,
        startTamp : 0,
        endTamp : 0,
        x : 0,
        imgWidth : 0,
        imgHeight : 0,
        imgList : [],
        isSuccess : true,
        startSlider : false,
        card_image: [
          'static/images/card1.jpg',
          'static/images/card2.jpg'
        ],
        code:"",
        auth_code:false,
        start:false,
        times:10,
        trim:"",
        interval:{}
      }
    },
    created() {
      this.$nextTick(() => {
        //this.showCard()
      })
      
    },
    watch: {
      // '$route': 'checkedRouter'
    },
    mounted() {
      this.$refs.flipOver.style.height = document.body.clientHeight + 'px'
      window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      })
    },
    methods: {
      showCard(){
        if(this.times>0){
          let _this = this
          _this.interval = setInterval(function(){
            _this.times--
            if(_this.times == 0){
              _this.start = false
              _this.stopInterval()
            }
          },1000)
        }
      },
      stopInterval(){
        clearInterval(this.interval)
        
      },
      showStatus(){
        if(!this.start){
          this.times = 10
          this.showCard()
        }
        this.start = true
        this.auth_code = true
        
      },
      hiddenStatus(){
        if(this.auth_code){
          this.auth_code = false
        }
      }
    }
  }
</script>

<style scoped lang="less">

  .container{
    height: 100vh;
    width: 100vw;
    z-index: 9999;
    position: fixed;
    top: 0px;
    left: 0px;
    background-color:rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .flip{
      position: relative;
      perspective: 800;
      -ms-transform: perspective(500px);
      -moz-transform: perspective(500px);
      transform-style: preserve-3d;
      .front{
        position: absolute;
        top:0px;
        left:0px;
        backface-visibility: hidden;
        transform: rotateY(0deg);
        z-index: 2;
      }
      .frontIn{
        animation: zoomIn 0.5s linear 0s 1 both;
      }
      .frontOut{
        animation: zoomOut 0.5s linear 0s 1 both;
      }
      .backIn{
        animation: zoomIn 0.5s linear 0s 1 both;
      }
      .backOut{
        animation: zoomOut 0.5s linear 0s 1 both;
      }
      .back{
        position: relative;
        top:0px;
        left:0px;
        backface-visibility: hidden;
        transform: rotateY(-180deg);
      }
      img{
        border-radius:2%;
      }
    }
    input{
      width:70vw;
      height:30px;
      line-height: 30px;
      border-style: none;
      outline: none;
      border-radius: 15px;
      text-align:center;
      margin-top: 20px;
    }
    .title{
      color:#fff;
      font-weight: bold;
      margin-bottom:20px;
      font-size: 18px;
    }
  }
  @keyframes zoomIn{
    0% {
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
        -o-transform: rotateY(180deg);
        -ms-transform: rotateY(180deg);
        transform: rotateY(180deg);
        z-index:1;
    }
    100% {
        -webkit-transform: rotateY(0deg);
        -moz-transform: rotateY(0deg);
        -o-transform: rotateY(0deg);
        -ms-transform: rotateY(0deg);
        transform: rotateY(0deg);
        z-index: 3; /* 降级处理不支持CSS3的浏览器，只是简单的将back上升盖住front */
    }
  }
  @keyframes zoomOut{
    0% {
        -webkit-transform: rotateY(0deg);
        -moz-transform: rotateY(0deg);
        -o-transform: rotateY(0deg);
        -ms-transform: rotateY(0deg);
        transform: rotateY(0deg);
        z-index: 3; /* 降级处理不支持CSS3的浏览器，只是简单的将back上升盖住front */
    }
    100% {
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
        -o-transform: rotateY(180deg);
        -ms-transform: rotateY(180deg);
        transform: rotateY(180deg);
        z-index:1;
    }
  }
</style>
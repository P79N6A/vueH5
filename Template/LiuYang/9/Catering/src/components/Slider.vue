<template>
  <div  ref="slideBar" >
    <div class='slide-box'>
      <div class='slide-img-block'>
        <div class='slide-loading'></div>
        <div class='slide-img-border'>
          <div class='scroll-background slide-top'></div>
          <div class='slide-img-div'>
            <div class='slide-img-nopadding'>
              <img class='slide-img' ref='slideImg' src='' />
              <div class='slide-block' ref='slideBlock'></div>
              <div class='slide-box-shadow' ref='cutBlock'></div>
            </div>
            <div class='scroll-background  slide-img-hint-info' ref='slideHintInfo'>
              <div class='slide-img-hint'>
                <div class='scroll-background slide-icon' ref='slideIcon'></div>
                <div class='slide-text'>
                  <span class='slide-text-type' ref='slideType'></span>
                  <span class='slide-text-content' ref='slideContent'></span>
                </div>
              </div>
            </div>
          </div>
          <div class='scroll-background slide-bottom'>
            <div class='scroll-background slide-bottom-refresh' ref='refreshBtn' @click="refreshBtnClick" title='更换图片'></div>
            <div class='slide-bottom-no-logo'></div>
          </div>
        </div>
      </div>
      <div class='scroll-background scroll-bar'>
        <div class='scroll-background slide-btn' ref='slideBtn'  @touchstart="mousedown" @touchmove="mousemove" @touchend="mouseup"></div>
        <div class='slide-title' ref='slideHint'>
          <-按住滑块，拖动完成上面拼图
        </div>
      </div>
    </div>
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
        bg_image:'static/images/sprite.3.2.0.png'
      }
    },
    created() {
      this.$nextTick(() => {
        this.reToNewImg()
      })
      
    },
    watch: {
      // '$route': 'checkedRouter'
    },
    mounted() {
      for (var i = 1; i < 10; i++) {
        this.imgList.push(i + ".jpg");
      }
    },
    methods: {
      refreshBtnClick: function () {
        this.isSuccess = true;
        this.$refs.slideBlock.style.cssText = "";
        this.$refs.cutBlock.style.cssText = "";
        this.reToNewImg();
      },
      reToNewImg: function () {
        var _this = this;
        var index = Math.round(Math.random() * 8);         // 该方法有等于0 的情况
        console.log(index)
        var imgSrc = "static/images/" + this.imgList[index] + "";
        console.log(this.$refs)
        this.$refs.slideImg.setAttribute("src", imgSrc);
        this.$refs.slideBlock.style.backgroundImage = "url(" + imgSrc + ")";
        this.$refs.slideImg.onload = function (e) {
          e.stopPropagation();
          _this.imgWidth = _this.$refs.slideImg.offsetWidth;                   // 图片宽
          _this.imgHeight = _this.$refs.slideImg.offsetHeight;                 // 图片高
          _this.cutImg();
        }
      },
      cutImg: function () {
        //var _this = this;
        this.$refs.cutBlock.style.display = "block";
        var cutWidth = this.$refs.cutBlock.offsetWidth;                // 裁剪区域宽
        var cutHeight = this.$refs.cutBlock.offsetHeight;              // 裁剪区域高
        // left 
        this.resultX = Math.floor(Math.random() * (this.imgWidth - cutWidth * 2 - 4) + cutWidth);
        // top
        var cutTop = Math.floor(Math.random() * (this.imgHeight - cutHeight * 2) + cutHeight);
        // 设置样式
        this.$refs.cutBlock.style.cssText = "top:" + cutTop + "px;" + "left:" + this.resultX + "px; display: block;";
        this.$refs.slideBlock.style.top = cutTop + "px";
        this.$refs.slideBlock.style.backgroundPosition = "-" + this.resultX + "px -" + cutTop + "px";
        this.$refs.slideBlock.style.opacity = "1";
      },
      mousedown: function(e){
        console.log(e.touches[0])
        this.startSlider = true
        e.preventDefault();
        console.log(e.touches[0].clientX)
        this.startX = e.touches[0].clientX;
        this.startTamp = (new Date()).valueOf();
        var target = e.target;
        target.style.backgroundPosition = "0 -216px";
        this.$refs.slideHint.style.opacity = "0";
        if (this.isSuccess) {
          //this.cutImg();
        }
      },
      // 拖拽
      mousemove: function(event) {
        if(!this.startSlider) return
        this.x = event.touches[0].clientX - this.startX;
        console.log(this.startX)
        if (this.x < 0) {
          this.$refs.slideBtn.style.left = "0px";
          this.$refs.slideBlock.style.left = "2px";
        } else if (this.x >= 0 && this.x <= 217) {
          this.$refs.slideBtn.style.left = this.x + "px";
          this.$refs.slideBlock.style.left = this.x + "px";
        } else {
          this.$refs.slideBtn.style.left = "217px";
          this.$refs.slideBlock.style.left = "217px";
        }
        this.$refs.slideBtn.style.transition = "none";
        this.$refs.slideBlock.style.transition = "none";
      },
      // 鼠标放开
      mouseup :function() {
        if(this.startSlider){
          this.startSlider = false
          let _this = this
          var left = this.$refs.slideBlock.style.left;
          left = parseInt(left.substring(0, left.length - 2));
          if (this.resultX > (left - 10) && this.resultX < (left + 10)) {
            this.isSuccess = true;
            this.endTamp = (new Date()).valueOf();
            this.timer = ((this.endTamp - this.startTamp) / 1000).toFixed(1);
            // 裁剪图片(拼图的一块)
            this.$refs.slideBlock.style.opacity = "0";
            this.$refs.slideBlock.style.transition = "opacity 0.6s";
            // 裁剪的区域(黑黑的那一块)
            this.$refs.cutBlock.style.opacity = "0";
            this.$refs.cutBlock.style.transition = "opacity 0.6s";
            // 正确弹出的图标
            this.$refs.slideIcon.style.backgroundPosition = "0 -1207px";
            this.$refs.slideType.className = "slide-text-type greenColor";
            this.$refs.slideType.innerHTML = "验证通过:";
            this.$refs.slideContent.innerHTML = "用时" + _this.timer + "s";
            setTimeout(function () {
              _this.$refs.cutBlock.style.display = "none";
              _this.$refs.slideBlock.style.left = "2px";
              _this.reToNewImg();
            }, 600);
            this.$emit('sliderStatus', true)
            //this.options.success && this.options.success();
          } else {
            this.isSuccess = false;
            // 设置样式
            // 裁剪图片(拼图的一块)
            this.$refs.slideBlock.style.left = "2px";
            this.$refs.slideBlock.style.transition = "left 0.6s";
            // 错误弹出的图标
            this.$refs.slideIcon.style.backgroundPosition = "0 -1229px";
            this.$refs.slideType.className = "slide-text-type redColor";
            this.$refs.slideType.innerHTML = "验证失败:";
            this.$refs.slideContent.innerHTML = "拖动滑块将悬浮图像正确拼合";
            //_this.options.fail && _this.options.fail();
          }
          // 设置样式
          this.$refs.slideHintInfo.style.height = "22px";
          setTimeout(function () {
            _this.$refs.slideHintInfo.style.height = "0px";
          }, 1300);
          this.$refs.slideBtn.style.backgroundPosition = "0 -84px";
          this.$refs.slideBtn.style.left = "0";
          this.$refs.slideBtn.style.transition = "left 0.6s";
          this.$refs.slideHint.style.opacity = "1";
        }
      }
    }
  }
</script>

<style scoped lang="less">
.slider{
    height: 100vh;
    width: 100vw;
    z-index: 9999;
    position: fixed;
    top: 0px;
    left: 0px;
    background-color:rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.slide-box{
    display: block;
    position: relative;
}
.scroll-background{
  background-image: url("/../../assets/image/sprite.3.2.0.png");
  background-repeat: no-repeat;
}
.scroll-bar{
    margin-left: 15px;
    width: 261px;
    background-position: 0 0;
    height: 28px;
    position: relative;
}
.slide-btn{
    height: 44px;
    width: 44px;
    background-position: 0 -84px;
    cursor: pointer;
    display: block;
    position: absolute;
    left: 0;
    top: -9px;
    -moz-box-shadow: none;
    box-shadow: none;
    border-radius: 13px;
    z-index: 399;
}
.slide-title{
    cursor: default;
    position: absolute;
    left: 35px;
    font-size: 12px !important;
    color: #486c80;
    opacity: 1;
    filter: alpha(opacity=100);
    height: 28px;
    line-height: 28px !important;
    text-align: center;
    width: 220px;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
.slide-img-div{
    width: 260px;
    height: 116px;
    padding: 0 15px 2px 13px;
    position: relative;
    background-color: #f2ece1;
    border-left: 1px solid #e4ddd1;
    border-right: 1px solid #e4ddd1;
}
.slide-img-div img{
    width: 100%;
    height: 100%;
}
.slide-top{
    height: 14px;
    width: 290px;
    background-position: 0 -1341px;
    position: relative;
}
.slide-bottom{
    height: 28px;
    width: 290px;
    background-position: 0 -56px;
    line-height: 14px !important;
    position: relative;
    text-align: left;
    overflow: visible;
}
.slide-bottom-no-logo{
    margin-right: 15px;
    width: 65px;
    height: 16px;
    position: absolute;
    right: 0;
    top: 6px;
    background-color: #f2ece1 !important;
    cursor: default;
}
.slide-bottom-refresh{
    overflow: visible;
    display: block;
    zoom: 1;
    display: inline-block;
    vertical-align: bottom;
    cursor: pointer;
    margin-right: 16px !important;
    background-color: #f1e9de;
    margin: 6px 0 0 18px !important;
    height: 14px;
    width: 14px;
    background-position: 0 -1179px;
}

.slide-box-shadow{
    display: none;
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5) inset;
}
.slide-block{
    opacity: 0;
    position: absolute;
    top: 0;
    left: 2px;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background-repeat: no-repeat;
    background-attachment: scroll;
    border: 1px solid rgba(255, 255, 0, 0.8);
    background-size: 260px 116px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4), 0 0 10px 0 rgba(90, 90, 90, 0.4);
    box-sizing: border-box;
    z-index: 10;
}
.slide-img-nopadding{
    position: relative;
    width: 100%;
    height: 100%;    
}
.slide-icon{
    float: left;
    height: 22px;
    width: 26px;
}
.slide-img-hint{
    -webkit-font-smoothing: subpixel-antialiased;
    font-size: 12px !important;
    line-height: 22px !important;
    margin: 0 auto;
    position: relative;
}
.slide-text{
    text-align: left !important;
    color: #4b3f33;
}
.slide-img-hint-info{
    height: 22px;
    width: 260px;
    background-position: 0 -674px;
    height: 0;
    overflow: hidden;
    position: absolute;
    bottom: 1px;
    transition: height 0.3s;
    z-index: 11;
}
.redColor{
    color: red;
}
.greenColor{
    color: green;
}
.slide-img-border{
    margin-bottom: 3px;
}
</style>
<template>
  <section id="home" :style='{backgroundImage:"url("+images.home_bg_image+")"}'>
    <!--模板私有内容 -->
    <div class="prize-list">
      <div class="view" @touchstart="startMove" @touchmove="inMoving"
           @touchend="endMove"></div>
      <div class="prize-one" v-for="item,index of list" :key="item.item_id"></div>
    </div>
    <!--剩余抽奖次数 -->
    <div class="prize-draw-number-text" v-html="prizeDrawNumberText"></div>
    <div class="prize_draw" :style='{backgroundImage:"url("+images.prize_draw+")"}' @click="toBargain"></div>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        // ---------------------共用属性-----------------------
        prizeDrawNumberText: '', //抽奖次数提示语
        prizeDrawNumber: 5,
        loading: false,
        //---------------模板链接数据 end-------------
        config: {},
        images: {},
        listIndex: 0,
        moveStartNum: 0,
        moveDistance: 0,
        list: [],
        scale: 0,
        fontSize: 0,
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
        const self = this;
        this.config = config;
        this.images = this.config.images;
        this.list = this.images.prize_img_box;
        this.scale = 5 / (this.list.length - 1);
        setTimeout(function () {
          self.setListStyle();
        }, 10);
        const prizeDrawNumberText = this.config.tooltips.prize_draw_number;
        this.prizeDrawNumberText = prizeDrawNumberText.replace("{n}",
          '<span style="color: #fff"> ' + this.prizeDrawNumber + ' </span>');
      },
      setListStyle(){
        if ($('.view').css('transform')) {
          const matrix = $('.view').css('transform').split(',');
          const prize = document.getElementsByClassName('prize-one');
          for (let i = this.listIndex; i < this.list.length; i++) {
            const number = parseInt(matrix[4]) + this.fontSize * this.scale * i;
            const scale = (10 - i) / 10;
            $('.prize-one').eq(i).css({
              'background-image': 'url("' + this.list[i].prize_img + '")',
              '-webkit-transform': 'translateX(' + number + 'px) scale(' + scale + ')',
              'transform': 'translateX(' + number + 'px)  scale(' + scale + ')',
              'z-index': this.list.length + 5 - i
            });
          }
        }

      },
      startMove(e){
        const t = e.touches[0];
        this.moveStartNum = t.pageX;
      },
      inMoving(e){
        e.preventDefault();
        const t = e.touches[0];
        this.moveDistance = t.pageX - this.moveStartNum;
      },
      endMove(){
        if (this.moveDistance <= -20) {
          this.moveToLeft();
        } else if (this.moveDistance >= 20) {
          this.moveToRight();
        }
        this.moveDistance = 0;
      },
      moveToLeft(){
        if (this.listIndex < this.list.length - 1) {
          this.listIndex++;
          this.changeListStyle();
        }
      },
      moveToRight(){
        if (this.listIndex > 0) {
          this.listIndex--;
          this.changeListStyle();
        }
      },
      changeListStyle(){
        const matrix = $('.view').css('transform').split(',');
        const prize = document.getElementsByClassName('prize-one');
        for (let i = 0; i <= this.listIndex; i++) {
          const number = parseInt(matrix[4]) - this.fontSize * this.scale * i;
          const scale = (10 - i) / 10;
          $('.prize-one').eq(this.listIndex - i).css({
            '-webkit-transform': 'translateX(' + number + 'px) scale(' + scale + ')',
            'transform': 'translateX(' + number + 'px)  scale(' + scale + ')',
            '-webkit-transition': 'transform .6s',
            'transition': 'transform .6s',
            'z-index': this.list.length + 5 - i
          });
        }
        for (let i = 0; i < this.list.length; i++) {
          const number = parseInt(matrix[4]) + this.fontSize * this.scale * i;
          const scale = (10 - i) / 10;
          $('.prize-one').eq(this.listIndex + i).css({
            '-webkit-transform': 'translateX(' + number + 'px) scale(' + scale + ')',
            'transform': 'translateX(' + number + 'px)  scale(' + scale + ')',
            '-webkit-transition': 'transform .6s',
            'transition': 'transform .6s',
            'z-index': this.list.length + 5 - i
          });
        }
      },
      toBargain(){
        this.$emit('toBargain', this.list[this.listIndex].item_id);
      },
    }
  };
</script>
<style scoped lang='less'>
  #home {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    .prize-list {
      position: absolute;
      left: 50%;
      bottom: 10.75rem;
      margin-left: -8rem;
      width: 16rem;
      height: 7rem;
      .view {
        position: absolute;
        left: 50%;
        top: 0;
        z-index: 50;
        -webkit-transform: translateX(-4.25rem);
        transform: translateX(-4.25rem);
        width: 8.5rem;
        height: 7rem;
      }
      .prize-one {
        position: absolute;
        left: 50%;
        top: 0;
        z-index: 1;
        width: 8.5rem;
        height: 7rem;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }

    /*剩余次数*/
    .prize-draw-number-text {
      position: absolute;
      bottom: 8rem;
      z-index: 2;
      width: 100%;
      text-align: center;
      font-size: .8rem;
      color: orange;
    }
    .prize_draw {
      position: absolute;
      left: 50%;
      bottom: 4.25rem;
      margin-left: -4.25rem;
      width: 8.5rem;
      height: 2.5rem;
      background-repeat: no-repeat;
      background-size: cover;
    }

  }
</style>

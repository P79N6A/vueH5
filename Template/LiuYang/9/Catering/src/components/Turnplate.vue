<template>
  <div class="turnplat" :style="{backgroundImage:'url('+ this.config.bg_image +')'}">
    <!--抽奖圆盘-->
    <canvas id="prizeDisc" ref="prizeDisc" :style="{transform:'rotate('+this.rotationAngle+'deg)'}"></canvas>
    <img :src="this.config.button"  id="zhizhen" ref="zhizhen" @click="startTurn">
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
        config:{},
        hasShowSilkBag: false, //是否展示锦囊
        hasShowPrizeResult: false, //是否展示抽奖结果
        inDraw: false, //是否处于抽奖状态
        rotationAngle: 0,
        hasGetPrize: false, // 当前轮数是否已抽奖
        prizeDrawNumberText: '', //抽奖次数提示语
        prizeDrawNumber: 5, //默认抽奖次数
        prize: -1, //默认奖品
        prizeInfo: {},
        setRotate:{},
        fontSize: parseInt(window.getComputedStyle(document.querySelector("html")).fontSize), //当前屏幕下字体大小
        // ---------------------私有属性-----------------------
        trunplatConfig: {
            outsideRadius:17, //把画canvas的区域分成20个同心圆，以下三个属性填写其所占的同心圆的个数
            insideRadius:6,
            textRadius:13,
            zpBgImg:"https://download.aikaka.com.cn/003a3d58989af3a0f07370648e9b4ea6?f=png",
            color: [
            "#FF9F1A",
            "#D00002",
            "#FF9F1A",
            "#D00002",
            "#FF9F1A",
            "#D00002"],
            fontColor: [
            "#ffffff||#ffffff",
            "#ffffff||#ffffff",
            "#ffffff||#ffffff",
            "#ffffff||#ffffff",
            "#ffffff||#ffffff",
            "#ffffff||#ffffff"],
            fontSize: [
            "bold 20pt Microsoft YaHei",
            "bold 20pt Microsoft YaHei",
            "bold 20pt Microsoft YaHei",
            "bold 20pt Microsoft YaHei",
            "bold 20pt Microsoft YaHei",
            "bold 20pt Microsoft YaHei"],
            prizes: [
            "纤维+||赠饮一罐",
            "现金红包",
            "谢谢参与",
            "纤维+||赠饮一罐",
            "现金红包",
            "谢谢参与",]
        }
      }
    },
    created() {
      this.config = this.prizeImg
      this.$set(this.trunplatConfig, "zpBgImg", this.prizeImg.bg_image)
      this.$nextTick(() => {
        this.start()
        // let prizeDisc = this.$refs.prizeDisc,
        // canvasW = 20 * this.fontSizes,
        // canvasH = 20 * this.fontSizes

        // prizeDisc.setAttribute("width", canvasW)
        // prizeDisc.setAttribute("height", canvasH)
        // console.log(this.$refs)
      })
    },
    watch: {
      // '$route': 'checkedRouter'
    },
    computed: {
    },
    mounted() {

    },
    methods: {
      start(){
        this.createdCtx()
        
      },
      //画转盘
      createdCtx() {
        let prizeDisc = this.$refs.prizeDisc
        
        let turnplate = this.trunplatConfig
        let arc = Math.PI / (turnplate.color.length / 2)
        if (prizeDisc) {
          let ctx = prizeDisc.getContext("2d")
          //let ratio = this.getPixelRatio(ctx)
          let ratio = 2
          let canvasW = 18 * this.fontSize * ratio,
            canvasH = 18 * this.fontSize * ratio
          prizeDisc.setAttribute("width", canvasW )
          prizeDisc.setAttribute("height", canvasH )
          //ctx.scale(2, 2)
          //console.log(ratio)
          ctx.clearRect(0, 0, canvasW, canvasH)
          //let newImg = new Image()
          //newImg.src = turnplate.zpBgImg
          //ctx.drawImage(newImg, 0, 0, canvasW, canvasH)

          //ctx.strokeStyle = "#000000"
          let line_height = 48, angle, prizesNum = turnplate.color.length, texts = turnplate.prizes, fontSize = turnplate.fontSize, fontColor = turnplate.fontColor
          let textRedis = parseInt((canvasW - 2) * turnplate.textRadius / 40)
          for (let i = 0; i < prizesNum; i++) {
            angle = 2 * Math.PI * (i / prizesNum)
            ctx.beginPath()
            ctx.fillStyle = turnplate.color[i]
            ctx.strokeStyle = turnplate.color[i]
            ctx.arc(canvasW / 2, canvasH / 2, (canvasW - 2 * this.fontSize) * turnplate.outsideRadius / 40, angle, arc + angle, false)
            ctx.arc(canvasW / 2, canvasH / 2, (canvasW - 2 * this.fontSize) * turnplate.insideRadius / 40, arc + angle, angle, true)
            ctx.fill()
            ctx.stroke()

            ctx.save()
            //绘制文字
            
            ctx.font = fontSize[i]
            //ctx.fillStyle = "#ffffff"
            //ctx.font = 'bold 6pt Microsoft YaHei'
            ctx.translate(parseInt(canvasW / 2) + parseInt(textRedis * Math.cos(angle + arc / 2)), parseInt(canvasH / 2) + parseInt(textRedis * Math.sin(angle + arc / 2)))
            ctx.rotate(angle + arc / 2 + Math.PI / 2)
            let textArr = texts[i].split("||")
            let textColor = fontColor[i].split("||")
            for (let j = 0; j < textArr.length; j++) {
              ctx.fillStyle = textColor[j]
              ctx.fillText(textArr[j], -ctx.measureText(textArr[j]).width / 2, j * line_height)
            }
            ctx.restore()
          }
          
        }
      },
      getPixelRatio(context) {
        var backingStore = context.backingStorePixelRatio
          || context.webkitBackingStorePixelRatio
          || context.mozBackingStorePixelRatio
          || context.msBackingStorePixelRatio
          || context.oBackingStorePixelRatio
          || context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;

      },
      rotateFns(item, finishFun, allTime = 4) {
        if (!this.inDraw) {
          this.inDraw = !this.inDraw
          let angle = item * (360 / this.trunplatConfig.color.length) - 360 / this.trunplatConfig.color.length * 2, times = 60
          angle += this.getMyRand()
          let myAngle = 0, maxV = 0, t1 = allTime*times, count1=0, count2=0, a1 = angle / (t1 * t1)
          this.setRotate = setInterval(() => {
            count1++
            if (count1 <= t1/2) {
              myAngle = a1*count1*count1/2
            } else if (count1 > t1/2 && count1 < t1) {
              count2 = t1 - count1
              myAngle = angle - (a1 * count2 * count2 / 2)
            } else {
              myAngle = angle
              clearInterval(this.setRotate)
              this.inDraw = !this.inDraw
              finishFun()
            }
            this.rotationAngle = myAngle
          }, 1000 / times)
        }
      },
      //获取随机数
      getMyRand() {
        return (Math.floor(Math.random() * 10) + 20) * 360
      },
      //开始转动
      startTurn(){
        if(!this.inDraw){
          this.$emit('rotateFns', this.rotateFns)
        }
      }
    }
  }
</script>

<style scoped lang="less">
.turnplat{
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  
  zoom:0.5;
  #prizeDisc{
      position: relative;
      rotation-point:50vw 50vh;
  }
  #zhizhen{
      position: relative;
      width: 6rem;
      top:-13.2rem;
  }
}
</style>
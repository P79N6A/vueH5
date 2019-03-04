<template>
  <section id='myAlert' ref = "myAlert">
    
    <div class="alertContent">
      <img :src="content.button" class="x" @click="hideAlert">
      <!-- <div class="title">互动活动条款</div> -->
      <div class="show showhidden" @scroll="myscroll" ref="show1">
        <!-- <img :src="content.content" alt="" class="item"> -->
        <p style="text-align:center;">互动活动条款</p>
        <p>参与方式: </p>
        <p>每人共有3次抽奖机会</p>
        <p></p>
        <p>活动时间: </p>
        <p>10.15-11.15</p>
        <p></p>
        <!-- <p><input type="text"></p> -->
        <p>奖品详情:</p>
        <p>一等奖:UFC&Monster超级礼包</p>
        <p>二等奖:UFC决赛门票一张</p>
        <p>三等奖:Monster免费赠饮一瓶</p>
        <p></p>
        <p>兑奖方式:</p>
        <p>所有中奖者产生后，Monster
          Energy将安排在7个工作日内，通过中奖人提供的邮箱或电话联系，核实信息。中奖者需提供真实姓名，手机号或其他电话号码及接收快递的地址和邮编。经核实无误后，30个工作日内，奖品会使用特快专递给中奖者。</p>
        <p></p>
        <p>免责声明:</p>
        <p>如本次活动因不可抗力等原因无法执行时，Monster Energy有权予以暂停、终止或修改活动内容。所有参加者提供的个人信息（包括姓名、手机号或其他电话号码、地址、电邮等）仅用于与进行本次抽奖活动。</p>
      </div>
      <div class="show left" ref="show2" @touchmove.prevent>
        <!-- <img :src="content.content" alt="" class="item"> -->
        <p>参与方式: </p>
        <p>每人共有3次抽奖机会</p>
        <p></p>
        <p>活动时间: </p>
        <p>10.15-11.15</p>
        <p></p>
        <!-- <p><input type="text"></p> -->
        <p>奖品详情:</p>
        <p>一等奖:UFC&Monster超级礼包</p>
        <p>二等奖:UFC决赛门票一张</p>
        <p>三等奖:Monster免费赠饮一瓶</p>
        <p></p>
        <p>兑奖方式:</p>
        <p>所有中奖者产生后，Monster Energy将安排在7个工作日内，通过中奖人提供的邮箱或电话联系，核实信息。中奖者需提供真实姓名，手机号或其他电话号码及接收快递的地址和邮编。经核实无误后，30个工作日内，奖品会使用特快专递给中奖者。</p>
        <p>免责声明:</p>
        <p>如本次活动因不可抗力等原因无法执行时，Monster Energy有权予以暂停、终止或修改活动内容。所有参加者提供的个人信息（包括姓名、手机号或其他电话号码、地址、电邮等）仅用于与进行本次抽奖活动。</p>
      </div>
      <!-- <img :src="content.button" class="x" @click="hideAlert"> -->
    </div>
  </section>
</template>
<script>
  export default {
    props: [
      'content'
    ],
    data() {
      return {

      }
    },
    computed: {
    },
    created() {
      console.log(this.content)
    },
    mounted() {
      this.$refs.myAlert.style.height = document.documentElement.clientHeight + 'px'
    },
    methods: {
      //弹窗
      showAlert() {
        this.$emit('rulesStatus', false)
      },
      hideAlert(){
        this.$emit('rulesStatus', false)
      },
      myscroll(){
        this.$refs.show2.scrollTop = this.$refs.show1.scrollTop
        console.log(this.$refs.show1.scrollTop)
      }
    }
  }
</script>
<style lang="less" scoped>
  #myAlert{
    height: 100vh;
    width: 100vw;
    z-index: 999;
    position: fixed;
    top: 0px;
    left: 0px;
    background-color:rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    /* .rules{
      color: red !important;
      text-decoration-line: underline !important;
      font-size: 0.8rem;
    } */
    .alertContent{
      position: relative;
      left: 13vw;
      width: 74vw;
      top:-5vh;
      height: 60vh;
      min-height: 60vh;
      border:1px solid #94D600;
      background-color:#2F2F2F;
      overflow: hidden;
      .title{
        position: absolute;
        font-size: 9pt;
        top:5vh;
        height:2.5vh;
        line-height:14px;
        color:#a2d342;
        width:100%;
        text-align:center;
      }
      
      .show{
        /* direction: rtl; */
        max-height: 53vh;
        position: absolute;
        top:5vh;
        left: 4vw;
        width:68vw;
        overflow-x:hidden;
        overflow: auto;
        background-color:#2F2F2F;
        color:#94D600;
        text-align: left;
        .item{
          margin-top: 10px;
          margin-bottom: 20px;
          width:100%;
        }
        p{
          direction: ltr;
          font-size: 9pt;
          padding-left: 15px;
          min-height: 14px;
          line-height: 14px;
          word-break:break-all;
          margin:3px;
        }
      }
      .showhidden::-webkit-scrollbar {display:none}
      .left{
        max-height: 50vh;
        position: absolute;
        top:8vh;
        left: -63vw;
        width:68vw;
        overflow-x:hidden;
        overflow: auto;
        background-color:#2F2F2F;
        color:#2F2F2F;
        text-align: left;
      }
      .left::-webkit-scrollbar{
        border-radius: 5px;
        width:10px;

      }
      .left::-webkit-scrollbar-track{
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 60% 100%;
        background-image: url("https://download.aikaka.com.cn/e324bd656c9b64b55cf99a5d4009e783?f=png");
      }
      .left::-webkit-scrollbar-thumb {
        background-color: #a2d342;
        border: 2px solid white;
        border-radius: 10px;
        width:3px;
      }
      .x{
        position: absolute;
        right: 2vw;
        top: 2vw;
        width:8vw;
      }
    }
  }
  
</style>
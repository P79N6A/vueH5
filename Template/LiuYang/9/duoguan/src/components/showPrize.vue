<template>
  <section id='showPrize'>
    <div class="alertContent">
      <div class="show">
        <img :src="prize.prize_img" @click="hideAlert" alt="" class="item">
        <div v-if="prize.rules" class="rules" @click="showAlert"></div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    props: [
      'prize'
    ],
    data() {
      return {

      }
    },
    computed: {

    },
    watch: {

    },
    created() {
      console.log(this.prize)
    },
    mounted() {
      console.log(this.prize)
    },
    methods: {
      //弹窗
      showAlert() {
        this.$emit('showRulesStatus', true)
      },
      hideAlert(){
        this.$emit('showStatus', false)
      }
    }
  }
</script>
<style lang="less" scoped>
  #showPrize{
    .rules{
      color: red !important;
      text-decoration-line: underline !important;
      font-size: 0.8rem;
    }
    .alertContent{
      height: 100vh;
      width: 100vw;
      z-index: 990;
      position: fixed;
      top: 0px;
      left: 0px;
      background-color:rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      .show{
        position: absolute;
        top:-20px;
        left: 5vw;
        width:90vw;
        border-radius:4px;
        overflow: scroll;
        .item{
          width:100%;
        }
        .rules{
          height: 30px;
          width:24vw;
          position: relative;
          top: -35px;
          left:32vw;
          background-color: rgba(0, 0, 0, 0);
        }
      }
    }
  }
  
</style>
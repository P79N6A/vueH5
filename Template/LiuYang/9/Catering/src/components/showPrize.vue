<template>
  <section id='showPrize'>
    <div class="alertContent">
      <div class="show">
        <img :src="prize.prize_img" @click="hideAlert" alt="" :class="prize.table?'table':'item'">
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
        top:-30px;
        width:100vw;
        border-radius:4px;
        overflow: scroll;
        .table{
          width:70%;
          margin-top: 80%;
        }
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
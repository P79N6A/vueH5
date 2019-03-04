<template>
  <section id='myAlert'>
    
    <div class="alertContent">
      <div class="show">
        <img :src="content.content" alt="" class="item">
        
      </div>
      <img :src="content.button" class="x" @click="hideAlert">
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
      
    },
    methods: {
      //弹窗
      showAlert() {
        this.$emit('rulesStatus', false)
      },
      hideAlert(){
        this.$emit('rulesStatus', false)
      }
    }
  }
</script>
<style lang="less" scoped>
  #myAlert{
    .rules{
      color: red !important;
      text-decoration-line: underline !important;
      font-size: 0.8rem;
    }
    .alertContent{
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
      .show{
        max-height: 70vh;
        position: relative;
        left: 9vw;
        width:82vw;
        border:2px solid #fff;
        border-radius:4px;
        background-color:red;
        overflow: scroll;
        .item{
          margin-top: 10px;
          margin-bottom: 20px;
          width:100%;
        }
      }
      .x{
        position:relative;
        left: 45vw;
        height:10vw;
        width: 10vw;
        margin-top: 20px;
        text-align: center;
      }
    }
  }
  
</style>
<template>
  <section id='followUs'>
    <div class="mask" @click="hideFollowUs"></div>
    <div class="follow-us-code">
      <img class="code" src="../assets/code.jpg" alt="请上传二维码图片">
      <img class="fingerprint" src="../assets/fingerprint.png" alt="">
      <div class="describe">长按指纹 识别二维码</div>
    </div>
  </section>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      hideFollowUs(){
        this.$emit('child-say', false);
      },
    }
  }
</script>
<style lang="less" scoped>
  #followUs {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 201;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .8);
    }
    .follow-us-code {
      position: absolute;
      bottom: 7.25rem;
      left: 50%;
      z-index: 201;
      padding: .5rem 0;
      margin-left: -7.5rem;
      box-sizing: border-box;
      width: 15rem;
      height: 20.5rem;
      text-align: center;
      background: #fff;
      border-radius: 10px;
      .code {
        display: inline-block;
        margin: 0 auto;
        width: 9.25rem;
        height: 9.25rem;
        background: #ccc;
      }
      .fingerprint {
        display: inline-block;
        margin: .5rem auto .725rem;
        width: 7rem;
        height: 7rem;
      }
      .describe {
        font-size: .7rem;
        color: #666;
      }
    }
  }
</style>

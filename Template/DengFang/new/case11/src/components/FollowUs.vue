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
  @fontSize: 40rem;
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
      bottom: 290/@fontSize;
      left: 50%;
      z-index: 201;
      padding: 20/@fontSize 0;
      margin-left: -300/@fontSize;
      box-sizing: border-box;
      width: 600/@fontSize;
      height: 820/@fontSize;
      text-align: center;
      background: #fff;
      border-radius: 20/@fontSize;
      .code {
        display: inline-block;
        margin: 0 auto;
        width: 370/@fontSize;
        height: 370/@fontSize;
        background: #ccc;
      }
      .fingerprint {
        display: inline-block;
        width: 280/@fontSize;
        height: 280/@fontSize;
      }
      .describe {
        font-size: 28/@fontSize;
        color: #666;
      }
    }
  }
</style>

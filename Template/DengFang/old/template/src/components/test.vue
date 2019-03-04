<template>
  <section id="template">
    <h1>{{images.tooltips.hello}}</h1>
    <img :src="images.images.bg_image" alt="">
  </section>
</template>
<script>
  export default {
    data() {
      return {
        images: {},
      }
    },
    created(){
      this.images = config;
      console.log(config)
    }
  }
</script>
<style lang="less" scoped>
  #template {
    width: 100%;
    img {
      width: 100%;
    }
  }
</style>

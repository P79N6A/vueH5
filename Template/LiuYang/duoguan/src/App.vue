<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
        // wx.ready(function () {
        //     //隐藏右上角菜单禁用分享
        //     wx.hideOptionMenu()
        // })
      },
}
</script>

<style lang="less">
  @import "assets/common";
  @import "assets/swiper";
</style>

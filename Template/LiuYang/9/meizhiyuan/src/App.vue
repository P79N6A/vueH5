<template>
  <!-- <div id="app" v-cloak> -->
  <div id="app" >
    <transition :name="transitionName">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        transitionName: ""
      }
    },
    watch: {
      $route(to, from){
        if(to.meta.index < from.meta.index){
          this.transitionName = "slide-right"
        }else{
          this.transitionName = "slide-left"
        }
      }
    }
  }
</script>

<style lang="less">
  @import "assets/common";
  @import "assets/myswiper";
  @import "assets/slide";
</style>

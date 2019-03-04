<template>
    <div class="content">
        <img src="static/nostart/logo2.png" class="logo" alt="">
        <img src="static/nostart/zi.png" class="zi" alt="">
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        methods: {
            getBack(){
                window.history.go(-1)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "Index2";
</style>
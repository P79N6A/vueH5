<template>
  <section class="alert" ref = "myAlert" @touchmove.prevent>
    <div class="content">
      <div class="title">
        <img src="static/images/download.png" class="icon" alt="">很遗憾
      </div>
      <div class="mess" v-html="alert"></div>
      <hr style="height:1px;width:100%;border:none;border-top:1px solid #E4E4E4;" />
      <div class="footer" @click="hiddenAlert">
        知道了
      </div>
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
      alert(){
        return this.content
      }
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
      hiddenAlert(){
        this.$emit('rulesStatus', false)
      }
    }
  }
</script>
<style lang="less" scoped>
  .alert{
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        height: 100%;
        width: 100%;
        overflow:hidden;
        .content{
            width:80%;
            position: relative;
            top: 50vh;
            left: 50vw;
            transform: translate(-50%,-50%);
            background-color: #fff;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .title{
                padding-top: 2rem;
                height: 2rem;
                .icon{
                    display: inline-block;
                    position: relative;
                    top:0.2rem;
                    width:1.6rem;
                    padding-right: 0.6rem;
                }
                font-size: 1.4rem;
                margin-bottom: .8rem;
            }
            .mess{
                max-width: 80%;
                font-size: 1rem;
                color: #707070;
                word-break: break-all;
            }
            .footer{
                text-align:center;
                font-size:18px;
                height:42px;
                width:100%;
                line-height: 40px;
                color:green;
            }
        }
    }
</style>
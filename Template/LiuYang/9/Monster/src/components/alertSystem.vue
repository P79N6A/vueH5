<template>
  <section class="alert" ref = "myAlert" @touchmove.prevent>
    <div class="content">
      <div class="title" v-if="type!=1">
        <img :src="this.srcImg" class="icon" alt="">很遗憾
      </div>
      <div class="title" v-else>
        <img :src="this.srcImg" class="icon" alt="">核销通过
      </div>
      <div class="mess" v-html="alert"></div>
      <hr style="height:1px;width:100%;border:none;border-top:1px solid #E4E4E4;" />
      <div :class="this.type==1?'footers':'footer'" @click="hiddenAlert">
        {{butTxt}}
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    props: [
      'content',
      'type'
    ],
    data() {
      return {
        srcImg:"static/images/download.png",
        butTxt:"知道了"
      }
    },
    computed: {
      alert(){
        return this.content
      }
    },
    created() {
      if(this.type == 1){
        //成功
        this.srcImg = "static/images/ok.png"
        this.butTxt = "好的！"
      }else if(this.type == 2){
        this.srcImg = "static/images/x.png"
      }
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
                font-size: 1.2rem;
                margin-bottom: .8rem;
            }
            .mess{
                max-width: 80%;
                font-size: 0.9rem;
                color: #707070;
                word-break: break-all;
            }
            .footers{
                text-align:center;
                font-size:18px;
                height:42px;
                width:100%;
                line-height: 40px;
                color:black;
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
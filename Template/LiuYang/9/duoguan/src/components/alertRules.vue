<template>
  <section id='myAlert'>
    <div class="alertContent">
      <div class="show" ref="rules">
        <img :src="content.content" alt="" class="item">
      </div>
      <img :src="content.button" class="x" @click="hideAlert">
    </div>
  </section>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import BScroll from 'better-scroll'
  export default {
    props: [
      'content'
    ],
    data() {
      return {
        
      }
    },
    computed: {
      ...mapState({
        has_show_rules: state => state.has_show_rules
      })
    },
    watch: {
      has_show_rules:function(curVal, oldVal){
        if(curVal){
          this.getBScroll()
        } else {
          console.log(curVal)
        }
      }
    },
    created() {
    },
    mounted() {
      
    },
    methods: {
      ...mapActions([
        'changeShowRules'
      ]),
      //弹窗
      showAlert() {
        this.changeShowRules(false)
        this.$emit('rulesStatus', false)
      },
      hideAlert(){
        this.changeShowRules(false)
        this.$emit('rulesStatus', false)
      },
      //添加滚动插件
      getBScroll(){
        this.$nextTick(() => {
          if (this.has_show_rules) {
            let rules = this.$refs.rules
            new BScroll(rules, {
              click: true
            })
          } else {
            setTimeout(() => {
              let rules = this.$refs.rules
              new BScroll(rules)
            }, 200)
          }
        })
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
        overflow: hidden;
        .item{
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
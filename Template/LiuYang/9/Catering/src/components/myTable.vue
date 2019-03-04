<template>
  <section id='showPrize'>
    
    <div class="myTable">
      <!-- <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p> -->
      <input type="text" v-model.trim.lazy="buyer_name" ref="buyer_name" style="font-size: 12pt;" placeholder="姓名" @keyup="myChange">
      <input type="tel" v-model.trim.number.lazy="buyer_phone" ref="buyer_phone" style="font-size: 12pt;" placeholder="手机号码" @keyup="myChange">
      <input type="text" v-model.trim.lazy="buyer_addr" ref="buyer_addr" style="font-size: 12pt;" placeholder="身份证号" @keyup="myChange">
      <img src="static/page1/yl.png" class="yl" />
      <img src="static/page3/anniu.png" class="anniu5" @click="submitMyTable"/>
    </div>
  </section>
</template>
<script>
  export default {
    props: [

    ],
    data() {
      return {
        buyer_name: "",
        buyer_phone: "",
        buyer_addr: "",
        errors:[]
      }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
      submitMyTable(){
        this.errors = []
        if (!this.buyer_name || this.buyer_name.length > 18) {
          this.errors.push("Name error.")
          this.$refs.buyer_name.className = "error"
          return
        }
        if (!this.buyer_phone || this.buyer_phone.length > 18) {
          this.errors.push('Phone error.')
          this.$refs.buyer_phone.className = "error"
          return
        }
        if (!this.buyer_addr) {
          this.errors.push('Address required.')
          this.$refs.buyer_addr.className = "error"
          return
        }
        //把验证成功的信息发送给父组件
        let submitInfo = {}
        submitInfo['buyer_name'] = this.buyer_name
        submitInfo['buyer_phone'] = this.buyer_phone
        submitInfo['buyer_addr'] = this.buyer_addr
        this.$emit('submitInfo', submitInfo)
      },
      myChange(e){
        if(e.target.value && e.target.value.length<=18){
          e.target.classList = []
        }else{
          e.target.classList = ["error"]
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  #showPrize{
    height: 100%;
    .myTable{
      /* height: 40vh; */
      width: 80vw;
      position: absolute;
      left:10vw;
      top: 45%;
      display:flex;
      flex-direction: column;
      justify-content: center;
      align-items:center;
      input{
        width:65vw;
        height:30px;
        line-height: 30px;
        border-style: none;
        outline: none;
        border-radius: 15px;
        text-align:center;
        margin-bottom: 20px;
      }
      .yl{
        height:100px;
      }
      .error{
        background-color:rgba(255, 1, 1, 0.5);
      }
      .anniu5{
        height:46px;
        line-height: 46px;
        color:#fff;
        margin-top:-6px;
      }
    }
  }
  
</style>
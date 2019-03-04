<template>
    <section id='checkbox'>
        <div class="content">
            <div class="item">
                <div class="lable">身份</div>
                <img v-if="identityInfo" src="static/img/2.png" @click="cIdentity" alt="" class="check">
                <img v-else src="static/img/1.png" @click="cIdentity" alt="" class="check">
            </div>
            <div class="item">
                <div class="lable">定位</div>
                <img v-if="locationInfo" src="static/img/2.png" @click = "cLocation" alt="" class="check">
                <img v-else src="static/img/1.png" @click = "cLocation" alt="" class="check">
            </div>
        </div>
    </section>
</template>
<script>
    export default{
        props: [
            'identity',
            'location'
        ],
        data(){
            return{

            }
        },
        computed:{
            identityInfo: function () {
                return this.identity
            },
            locationInfo:function(){
                return this.location
            }
        },
        mounted(){

        },
        methods:{
            cIdentity(){
                this.$emit('identityInfo', !this.identity)
            },
            cLocation(){
                this.$emit('locationInfo', !this.location)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import 'Checkbox';
</style>
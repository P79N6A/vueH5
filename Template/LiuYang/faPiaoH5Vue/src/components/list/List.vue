<template>
    <section id='list'>
        <div class="title">
            <img src="static/img/tiao.png" alt="" class="title-bg">
            <div class="lable">直接识别结果</div>
        </div>
        <div class="content">
            <div class="lable">
                <!-- <div class="item"></div> -->
                <div class="item">属性</div>
                <div class="item">识别结果</div>
                <div class="item item1">置信度</div>
            </div>
            <div v-for="(value,index) in discernInfo" class="show" :class="index%2 === 0 ? 'odd' : 'even'">
                <div class="item">{{value.name}}</div>
                <!-- <div class="item">{{value.property}}</div> -->
                <div class="item" v-html = "value.value"></div>
                <div class="item item1">{{value.probability}}</div>
            </div>
        </div>
    </section>
</template>
<script>
    export default {
        props: [
            'discern'
        ],
        data() {
            return {

            }
        },
        watch: {
            'discernInfo': 'showList'
        },
        computed: {
            discernInfo: function () {
                return this.discern
            }
        },
        mounted() {
        },
        methods: {
            showList(){
            }
        }
    }
</script>
<style lang="less" scoped>
    @import 'List';
</style>
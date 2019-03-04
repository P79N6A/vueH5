<template>
    <div class="music-main" :style='{backgroundImage:"url("+(inPlay?music.bg_img:"")+")"}'>
        <!--音乐播放/暂停按钮-->
        <div class="music-image" :class='inPlay?"plays":""' :style='{backgroundImage:"url("+music.image+")"}' @click="playMusic"></div>
        <!--音乐播放器-->
        <audio loop="loop" id="audio" ref="myMusic" :src="music.src"></audio>
    </div>
</template>
<script>
    export default {
        props:[
            'my-music'
        ],
        data(){
            return {
                inPlay: false, //是否在播放音乐
            }
        },
        watch:{
            
        },
        computed:{
            music: function () {
                return this.myMusic
            }
        },
        mounted(){
            console.log(this.music)
        },
        methods:{
            playMusic() {        //播放暂停音乐
                this.inPlay = !this.inPlay;
                console.log(this.inPlay)
                let music = this.$refs.myMusic
                if (this.inPlay) {
                    music.play()
                } else {
                    music.pause()
                }
            },
        }
    }
</script>
<style lang="less" scoped>
    .music-main{
        height:15vw;
        width:15vw;
        position: absolute;
        top:2vw;
        right:2vw;
        background-size: contain;
        .music-image{
            height:9vw;
            width:9vw;
            position: relative;
            left:0;
            top:4vw;
            background-size: cover;
        }
        .plays{
            animation: rotate2d 1.2s linear infinite;
        }
        @keyframes rotate2d {
            0%{
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }
            100%{
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }
    }
    
</style>
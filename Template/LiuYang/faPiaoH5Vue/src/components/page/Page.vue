<template>
    <section id='page1'>
        <img src="static/img/page1.png" alt="" class="page1">
        <div class="main">
            <div class="title">
                <img src="static/img/caidan.png" class="lable">
                <div>定位与属性判断</div>
            </div>
            <div ref="content" class="content">
                <canvas ref="invoinceInfo" id="invoiceInfo" @click="checkItem" ></canvas>
            </div>
        </div>
    </section>
    
</template>
<script>
    
    export default {
        props:[
            'pageInfo',
            'identity',
            'location'
        ],
        data() {
            return {
                canvasW:0,
                canvasH:0,
                canvasL:0,
                canvasT:0,
                clientx:0,
                clienty:0,
                getValue:true,
                eValue: ""
            }
        },
        created(){
        },
        mounted() {
            //this.playCanvas()
            // console.log(this.info)
        },
        watch:{
            'info': 'playCanvas',
            'identity': 'playCanvas',
            'location': 'playCanvas'
        },
        computed:{
            info:function(){
                return this.pageInfo
            }
        },
        methods: {
            //画图
            playCanvas() {
                this.getBase64(this.info.url,()=>{
                    this.info.points.forEach(item => {
                        if(this.location){
                            this.drawRect(item.left_top, item.right_top, item.right_bottom, item.left_bottom, item.value, item.color, this.clientx, this.clienty)
                        }
                        if (this.identity && item.name.length > 0) {
                            this.writeWord(item.left_top, item.name, item.color)
                        }
                    })
                    
                })
            },
            //加载异步图片
            getBase64(url,callBack){
                let Img = new Image(), dataUrl
                Img.src = url
                Img.onload = ((result)=>{
                    let canvas = this.$refs.invoinceInfo
                    if(canvas){
                        this.canvasW = this.$refs.content.offsetWidth
                        this.canvasH = this.$refs.content.offsetHeight

                        let demo = this.$refs.content.getBoundingClientRect()
                        this.canvasL = parseInt(demo.x)
                        this.canvasT = parseInt(demo.y)

                        canvas.setAttribute('width',this.canvasW)
                        canvas.setAttribute('height', this.canvasH)
                        
                        this.ctx = canvas.getContext("2d")
                        this.ctx.beginPath()
                        this.ctx.clearRect(0, 0, this.canvasW, this.canvasH)
                        this.ctx.drawImage(Img, 0, 0, this.canvasW, this.canvasH)
                        callBack()
                    }
                })
            },
            //画框
            drawRect(left_top, right_top, right_bottom, left_bottom, value, color, X = 0,Y = 0){
                if(!this.ctx){
                    let canvas = this.$refs.invoinceInfo
                    this.ctx = canvas.getContext("2d")
                }
                this.ctx.beginPath()
                this.ctx.strokeStyle = color
                left_top = this.dispose(left_top)
                right_top = this.dispose(right_top)
                right_bottom = this.dispose(right_bottom)
                left_bottom = this.dispose(left_bottom)
                this.ctx.moveTo(left_top[0], left_top[1])
                this.ctx.lineTo(right_top[0], right_top[1])
                this.ctx.lineTo(right_bottom[0], right_bottom[1])
                this.ctx.lineTo(left_bottom[0], left_bottom[1])
                this.ctx.closePath()
                let check = this.ctx.isPointInPath(X, Y)
                if(this.location && check && this.getValue){
                    this.getValue = false
                    this.eValue   = value
                    this.$emit('child-say', this.eValue);
                    //this.ctx.fillStyle = 'rgba(253,0,2,.1)'
                    this.ctx.fillStyle = 'rgba(253,0,2,.1)'
                    this.ctx.fill()
                }else{
                    this.ctx.stroke()
                }
                
            },
            //写文字
            writeWord(left_top, values, color){
                if (!this.ctx) {
                    let canvas = this.$refs.invoinceInfo
                    this.ctx = canvas.getContext("2d")
                }
                this.ctx.font = "12px Georgia"
                this.ctx.beginPath()
                this.ctx.fillStyle = color
                left_top = this.dispose(left_top)
                this.ctx.fillText(values, left_top[0], left_top[1]-4);
            },
            //对输入的数据进行处理
            dispose(val){
                let item = []
                let px = parseFloat(val[0] * this.canvasW)
                item.push(px)
                px = parseFloat(val[1] * this.canvasH)
                item.push(px)
                return item
            },
            checkItem(e){
                let x = e.clientX - this.canvasL
                let y = e.clientY - this.canvasT
                this.clientx = x
                this.clienty = y
                this.getValue = true
                this.playCanvas()
            }
        }
    }
</script>
<style lang="less" scoped>
    @import 'Page';
</style>
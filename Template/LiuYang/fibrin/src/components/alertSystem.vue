<template>
  <section id='myAlert'>
      <div style="position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.54);z-index:10000;" id="alert_bg"></div>
      <div style="width:80%; position:fixed;top:50%;left:50%;z-index:10001;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);">
        <div style="overflow:hidden;background:#fff;border-radius:10px;margin-top:-36px;">
          <div style="width:100%;text-align:center;">
            <div style="font-size:20px;color:black;padding:30px 12px 8px 12px;line-height:140%;">
              <span style="font-size:20px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEyMjVBN0NGRDE4ODExRTY4REVGQkIwQUI1NzU0ODQzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEyMjVBN0QwRDE4ODExRTY4REVGQkIwQUI1NzU0ODQzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTIyNUE3Q0REMTg4MTFFNjhERUZCQjBBQjU3NTQ4NDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTIyNUE3Q0VEMTg4MTFFNjhERUZCQjBBQjU3NTQ4NDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6zmssZAAADnUlEQVR42tybwU8TQRTGH1RtLUTQJSWIXDCIImlIwFgv3rx40qgH4YQJ4cBdxXg0KH8Alx4MB9CDGg8kXrxxsYkSiQmVpKQhESQQNkgCSG1peG/7toGyLW13Zt3Ol3zpZLM77/12N7szr7NVU1NTIFi16B52EH0B3YyuR/t4n130H/Qyegn9A/2NvSUymROC+jmFfoC+h76J1o7Z/ww6gL6Us11HT6M/oN+h/9lNrNrm8efRI+g4egJ9twi4QtK4jwnuc4RjOA7oR7/kJIb5FhStZu47zrH8TgHSbTiPfor2gnx5OdY8x5YKGEa/R7eA82rh2GEZgE38hBuA/68BzqVJFOAV9Hd0N7hH3ZzTZbuAbeiv6EZwnxr5SraVC0iP7C/oGnCvajhHrRzAaZvvNKekca4ljWReoztEZtHQ0ABdXV1Ge3Z2FtbX10V238E5PyrmCt5G94s+zcFgEHw+n2FqS1A/514QkK7opIzofr/fsi1Yk7l3ZS7gCx71V6rqmcES8Cz6CVS+iOGcFaAKcKYe5wKeRA8pBDjETFnAOzwTV0W1PK/MAvaCenpoAtJ865aCgMTkJcCQy8ebdsapIRNQVV0nwKsKA3YSYKvCgK0EGFAYMECAdQoD1hHgaYUBfdWguAjwr8J8uwS4qTDgJgGuKQy4RoBxJyKl02nLtmTFCXDOiUiLi4uWbcmaowJNxIlI0WgUVldXjbau604BRkzAbSdmFA6CATNF6BZNoD8r+IAhpoT5on+rIKDBZBZJP0JmdYO0uozH4zHK9yQq2+/t7cmE22KmLGASPQaSSodUyQ6FQtmK9s7ODkQiEeNXksaY6VBddFTarLOz80jpnrZJ1OjBsaipDVmQ5q15UJqmyYTbsAIkPZcxNk0mk0e2pVIpKWNPZoB8gBRVeI3UauQiaTTTywx5AUmf0OMioy4sLEAsFjOuJJnatE2wxjn3Q6oqsBiPxqgdUBmKQp7qYKEZPS2q0ysATudcoVRAOvAGj+ncqm3OUS8HkBRDX3PppJhy6uEcoVxA0k80LY+YcRHcDOc0f9yOxVbVVvhshV0AF+ZcVorZudSy4SD6PmSWITutJY49WMpB5dRFablxOw+JEg6AJThWO8cG2YDGhAAyi1TpjxtajbssAYz6fIW+yLHKmnrYrWz/Rj9j0D6eg9l5d+rcRx/3OWz35IladU+r49+wcz8roJW6tP6a/uQ5+FnBJif/CyR+VrAvwAAQ5NpIh5URWwAAAABJRU5ErkJggg==) no-repeat left; background-size: 22px 22px;padding-left:30px">很遗憾</span>
            </div>
            <div style="font-size:13px;color:#707070;padding-bottom:5px;width:80%;margin-left:10%;word-break:break-all">您扫描的二维码为无效码，请按照活动规则获得正确的二维码后参与活动。</div>
            <div style="font-size:13px;color:#707070;padding-bottom:10px;width:80%;margin-left:10%;word-break:break-all"></div>
          </div>
          <div style="display:table;width:100%;table-layout:fixed;padding:7px 0;border-top:solid 1px #e4e4e4;">
            <div style="display:table-cell;vertical-align:middle;text-align:center;font-size:18px;height:30px;border-left:solid 1px #e4e4e4;color:green;"
              id="alert_confirm">知道啦</div>
          </div>
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
      hideAlert(){
        this.$emit('rulesStatus', false)
      }
    }
  }
</script>
<style lang="less" scoped>
  #myAlert{
    overflow: hidden;
    
  }
  
</style>
<template>
  <section id="silkBag">
    <div class="mask"></div>
    <div class="silk-bag-cnt">
      <div class="silk-bag-close" @click="hideSilkBag"></div>
      <section class="silk-bag-header">
        <div class="silk-bag-tab" v-bind:class="isActive?'silk-bag-tab-active':''" @click="changeView(true)">
          <span>活动说明</span>
        </div>
        <div class="silk-bag-tab" v-bind:class="isActive?'':'silk-bag-tab-active'" @click="changeView(false)">
          <span>我的奖品</span>
        </div>
      </section>
      <section class="silk-bag-content">
        <div class="illustrate" :style='{backgroundImage:"url("+images.illustrate_image+")"}' v-if="isActive"></div>
        <div class="record" id="record" v-if="!isActive">
          <scroller class="record-list">

            <div class="record-one" v-for="item of couponList" v-if="couponList.length > 0 ">
              <div class="record-one-parent" @click="toLink(item.go_url)">
                <div class="record-icon" :style='{backgroundImage:"url("+item.logo_img_src+")"}'></div>
                <div class="record-content">
                  <p class="record-content-title" v-html="item.title"></p>
                  <p class="record-content-describe" v-html="item.sub_title"></p>
                  <div class="record-content-time">
                    <p>有效期: <span v-html="item.begin_date" class="begin-date"></span>至</p>
                    <span v-html="item.end_date"></span>
                  </div>
                </div>
                <div class="record-one-status" v-if="item.status!='APPLIED'"
                     :class="item.status== 'OVERDUE'?'record-one-status-overdue':'record-one-status-consumed'"></div>
              </div>
            </div>
            <div v-if="couponList.length <= 0 && !loading" class="record-none">暂无中奖纪录</div>

          </scroller>
          <div class="record-bottom"></div>
          <div class="concern-us" @click="hasShowFollowUs = true">关注我们</div>
        </div>
      </section>
    </div>
    <FollowUs v-if="hasShowFollowUs" v-on:child-say="hideFollowUs"></FollowUs>
    <Loading v-if="loading"></Loading>
  </section>
</template>
<script>
  import FollowUs from './FollowUs.vue';
  import Loading from '../components/Loading.vue';
  import {getcouponlist} from '../services/getcouponlist';
  import{getConfig} from '../services/getConfig';
  export default {
    components: {FollowUs, Loading},
    data() {
      return {
        config: {},
        loading: false, //加载服务器数据
        images: {},
        isActive: true,
        hasShowFollowUs: false,
        hasAddEvent: false,
        couponList: [],
        hasGetList: false
      }
    },
    created(){
      getConfig(res => {
        this.config = res;
        this.images = res.images;
      });
    },
    methods: {
      changeView(isActive){
        let self = this;
        this.isActive = isActive;
        if (!isActive && !this.hasGetList) {
          this.hasGetList = true;
          const openId = this.$route.query.openid;
          const activityId = this.$route.query.activity_id;
          this.loading = true;
          setTimeout(function () {
            const couponlist = getcouponlist(openId, activityId, self.config.host);
            self.loading = false;
            if (couponlist.return_code != '200') {
              alert('获取数据失败！');
            } else {
              let applied = [], overdue = [], consumed = [];
              for (let item of couponlist.return_couponlist) {
                switch (item.status) {
                  case "OVERDUE":
                    overdue.push(item);
                    break;
                  case "APPLIED":
                    applied.push(item);
                    break;
                  case  "CONSUMED":
                    consumed.push(item);
                    break;
                }
              }
              self.couponList = applied.concat(consumed, overdue);
            }
          }, 50);
        }
      },
      hideSilkBag(){
        this.$emit('child-say', false);
      },
      hideFollowUs(){
        this.hasShowFollowUs = false;
      },
      toLink(url){
        window.location.href = url;
      }
    }
  }
</script>
<style lang="less" scoped>
  @fontSize: 40rem;
  #silkBag {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .8);
    }
    .silk-bag-cnt {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 102;
      padding: 40/@fontSize 0;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      color: #fff;
      .silk-bag-close {
        position: absolute;
        right: 40/@fontSize;
        top: 40/@fontSize;
        width: 100/@fontSize;
        height: 100/@fontSize;
        background: url("../assets/close.png") no-repeat;
        background-size: cover;
      }
      .silk-bag-header {
        height: 112/@fontSize;
        font-size: 0;
        border-bottom: 2/@fontSize solid #fff;
        .silk-bag-tab {
          display: inline-block;
          position: relative;
          width: 40%;
          height: 112/@fontSize;
          font-size: 32/@fontSize;
          line-height: 112/@fontSize;
          text-align: center;
        }
        .silk-bag-tab-active:before {
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -200/2/@fontSize;
          width: 200/@fontSize;
          height: 4/@fontSize;
          background: #fff;
        }
        .silk-bag-tab-active:after {
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -16/@fontSize;
          width: 0;
          height: 0;
          border-left: 16/@fontSize solid transparent;
          border-bottom: 16/@fontSize solid #fff;
          border-top: 16/@fontSize solid transparent;
          border-right: 16/@fontSize solid transparent;
        }
      }
      .silk-bag-content {
        height: 100%;
        .illustrate {
          width: 100%;
          height: 100%;
          background-size: cover;
        }
        .record {
          overflow: hidden;
          position: relative;
          text-align: center;
          height: 100%;
          .record-list {
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            padding: 20/@fontSize 0;
            box-sizing: border-box;
            max-height: 100%;
            text-align: left;
            font-size: 32/@fontSize;
            border-bottom: 300/@fontSize solid transparent;
            .record-none {
              padding-left: 20/@fontSize;
            }
            .record-one {
              padding: 12/@fontSize 24/@fontSize;
              box-sizing: border-box;
              background: #fff;
              .record-one-parent {
                position: relative;
                padding: 8/@fontSize;
                box-sizing: border-box;
                border: 2/@fontSize solid #ccc;
                .record-icon {
                  position: absolute;
                  left: 8/@fontSize;
                  top: 8/@fontSize;
                  width: 200/@fontSize;
                  height: 200/@fontSize;
                  background-repeat: no-repeat;
                  background-size: cover;
                }
                .record-content {
                  padding-left: 212/@fontSize;
                  box-sizing: border-box;
                  width: 100%;
                  height: 200/@fontSize;
                  .record-content-title {
                    font-size: 32/@fontSize;
                    color: #000;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                  }
                  .record-content-describe {
                    padding: 20/@fontSize 0;
                    font-size: 28/@fontSize;
                    color: #999;
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                  }
                  .record-content-time {
                    font-size: 28/@fontSize;
                    color: #000;
                    line-height: 1.5;
                    .begin-date {
                      padding-left: 10/@fontSize;
                    }
                  }
                }
                .record-one-status {
                  position: absolute;
                  right: -12/@fontSize;
                  bottom: 0;
                  width: 220/@fontSize;
                  height: 180/@fontSize;
                }
                .record-one-status-overdue {
                  background: url("../assets/overdue.jpg") no-repeat;
                  background-size: cover;
                }
                .record-one-status-consumed {
                  background: url("../assets/consumed.jpg") no-repeat;
                  background-size: cover;
                }
              }
            }
          }
          .record-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 300/@fontSize;
          }
          .concern-us {
            position: absolute;
            left: 50%;
            bottom: 180/@fontSize;
            margin-left: -230/@fontSize;
            width: 460/@fontSize;
            height: 100/@fontSize;
            font-size: 32/@fontSize;
            line-height: 100/@fontSize;
            background: #64a737;
            border-radius: 5/@fontSize;
          }
        }
      }
    }
  }

  #inner-cjuuk {
    background: #fff !important;
  }
</style>

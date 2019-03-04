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
      padding: 1rem 0;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      color: #fff;
      .silk-bag-close {
        position: absolute;
        right: 1rem;
        top: 1rem;
        width: 2.5rem;
        height: 2.5rem;
        background: url("../assets/close.png") no-repeat;
        background-size: cover;
      }
      .silk-bag-header {
        height: 2.8rem;
        font-size: 0;
        border-bottom: 1px solid #fff;
        .silk-bag-tab {
          display: inline-block;
          position: relative;
          width: 40%;
          height: 2.8rem;
          font-size: .8rem;
          line-height: 2.8rem;
          text-align: center;
        }
        .silk-bag-tab-active:before {
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -2.5rem;
          width: 5rem;
          height: 2px;
          background: #fff;
        }
        .silk-bag-tab-active:after {
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -8px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-bottom: 8px solid #fff;
          border-top: 8px solid transparent;
          border-right: 8px solid transparent;
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
            padding: .5rem 0;
            box-sizing: border-box;
            max-height: 100%;
            text-align: left;
            font-size: .8rem;
            border-bottom: 7.5rem solid transparent;
            .record-none {
              padding-left: .5rem;
            }
            .record-one {
              padding: 0 .625rem .625rem .625rem;
              box-sizing: border-box;
              background: #fff;
              .record-one-parent {
                position: relative;
                padding: .2rem;
                box-sizing: border-box;
                border: 1px solid #ccc;
                .record-icon {
                  position: absolute;
                  left: .2rem;
                  top: .2rem;
                  width: 5rem;
                  height: 5rem;
                  background-repeat: no-repeat;
                  background-size: cover;
                }
                .record-content {
                  padding-left: 5.3rem;
                  box-sizing: border-box;
                  width: 16.55rem;
                  height: 5rem;
                  .record-content-title {
                    font-size: .8rem;
                    color: #000;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                  }
                  .record-content-describe {
                    padding: .5rem 0;
                    font-size: .7rem;
                    color: #999;
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                  }
                  .record-content-time {
                    font-size: .7rem;
                    color: #000;
                    line-height: 1.5;
                    .begin-date {
                      padding-left: 10px;
                    }
                  }
                }
                .record-one-status {
                  position: absolute;
                  right: -.3rem;
                  bottom: 0;
                  width: 5.5rem;
                  height: 4.5rem;
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
            .record-one:first-child {
              padding-top: .625rem;
            }
          }
          .record-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 7.5rem;
          }
          .concern-us {
            position: absolute;
            left: 50%;
            bottom: 4.5rem;
            margin-left: -5.75rem;
            width: 11.5rem;
            height: 2.5rem;
            font-size: .8rem;
            line-height: 2.5rem;
            background: #64a737;
            border-radius: 5px;
          }
        }
      }
    }
  }
</style>

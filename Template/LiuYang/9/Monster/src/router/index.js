import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index/Index'
import Draw from '@/pages/Draw/Index'
import Table from '@/pages/Table/Index'
import Last from '@/pages/Last/Index'
import Rules from '@/pages/Rules/Index'
import Center from '@/pages/Center/Index'
import Sorry from '@/pages/Sorry/Index'
import Coupon from '@/pages/Coupon/Index'
import CouponCheck from '@/pages/Coupon/Check'
import CouponDetail from '@/pages/Coupon/Detail'
import CouponTest from '@/pages/Coupon/Test'
import None from '@/pages/None/Index'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  //base:'/cocacola/shakeApp/activities1808/yocha',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        title: "首页",
        index: 1
      }
    },
    {
      path: '/Draw',
      name: 'Draw',
      component: Draw,
      meta: {
        title: "奖品页",
        index: 2
      }
    },
    {
      path: '/Table',
      name: 'Table',
      component: Table,
      meta: {
        title: "提交信息",
        index: 3
      }
    },
    {
      path: '/Last',
      name: 'Last',
      component: Last,
      meta: {
        title: "提交成功",
        index: 4
      }
    },
    {
      path: '/Rules',
      name: 'Rules',
      component: Rules,
      meta: {
        title: "规则页",
        index: 5
      }
    },
    {
      path: '/Center',
      name: 'Center',
      component: Center,
      meta: {
        title: "个人中心",
        index: 6
      }
    },
    {
      path: '/Sorry',
      name: 'Sorry',
      component: Sorry,
      meta: {
        title: "失败页",
        index: 7
      }
    },
    {
      path: '/Coupon',
      name: 'Coupon',
      component: Coupon,
      meta: {
        title: "卡券页1",
        index: 8
      }
    },
    {
      path: '/CouponCheck',
      name: 'CouponCheck',
      component: CouponCheck,
      meta: {
        title: "卡券页2",
        index: 9
      }
    },
    {
      path: '/Coupon/Detail',
      name: 'CouponDetail',
      component: CouponDetail,
      meta: {
        title: "卡券详情页",
        index: 10
      }
    },
    {
      path: '/CouponTest',
      name: 'CouponTest',
      component: CouponTest,
      meta: {
        title: "条码卡券",
        index: 11
      }
    },
    {
      path: '/None',
      name: 'None',
      component: None,
      meta: {
        title: "未中奖",
        index: 12
      }
    }
  ]
})

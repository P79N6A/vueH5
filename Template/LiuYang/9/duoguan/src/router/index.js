import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index/Index'
import Draw from '@/pages/Draw/Index'
import Table from '@/pages/Table/Index'
import Show from '@/pages/Show/Index'

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
      path: '/Show',
      name: 'Show',
      component: Show,
      meta: {
        title: "提交成功",
        index: 4
      }
    }
  ]
})

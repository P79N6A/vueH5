import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index/Index'
import Show from '@/pages/Show/Show'
import Qrcode from '@/pages/Qrcode/Index'
import Onepiece from '@/pages/Qrcode/Onepiece'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta:{
        title:"首页",
        index:1
      }
    },
    {
      path: '/Show',
      name: 'Show',
      component: Show,
      meta: {
        title: "奖品页",
        index: 2
      }
    },
    {
      path: '/Qrcode',
      name: 'Qrcode',
      component: Qrcode,
      meta: {
        title: "二维码展示",
        index: 3
      }
    },
    {
      path: '/Onepiece',
      name: 'Onepiece',
      component: Onepiece,
      meta: {
        title: "one_piece",
        index: 4
      }
    }
  ]
})

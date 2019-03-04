import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index/Index'
import Nopage1 from '@/pages/Index/Index1'
import Nopage2 from '@/pages/Index/Index2'

import Nostart1 from '@/pages/Nostart/Index1'
import Nostart2 from '@/pages/Nostart/Index2'
import Nostart3 from '@/pages/Nostart/Index3'

import Nocoupon1 from '@/pages/Nocoupon/Index1'
import Nocoupon2 from '@/pages/Nocoupon/Index2'
import Nocoupon3 from '@/pages/Nocoupon/Index3'
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
        title: "404",
        index: 1
      }
    },
    {
      path: '/Nopage1',
      name: 'Nopage1',
      component: Nopage1,
      meta: {
        title: "404",
        index: 2
      }
    },
    {
      path: '/Nopage2',
      name: 'Nopage2',
      component: Nopage2,
      meta: {
        title: "404",
        index: 3
      }
    },
    {
      path: '/Nostart1',
      name: 'Nostart1',
      component: Nostart1,
      meta: {
        title: "404",
        index: 4
      }
    },
    {
      path: '/Nostart2',
      name: 'Nostart2',
      component: Nostart2,
      meta: {
        title: "404",
        index: 5
      }
    },
    {
      path: '/Nostart3',
      name: 'Nostart3',
      component: Nostart3,
      meta: {
        title: "404",
        index: 6
      }
    },
    {
      path: '/Nocoupon1',
      name: 'Nocoupon1',
      component: Nocoupon1,
      meta: {
        title: "404",
        index: 7
      }
    },
    {
      path: '/Nocoupon2',
      name: 'Nocoupon2',
      component: Nocoupon2,
      meta: {
        title: "404",
        index: 8
      }
    },
    {
      path: '/Nocoupon3',
      name: 'Nocoupon3',
      component: Nocoupon3,
      meta: {
        title: "404",
        index: 9
      }
    }
  ]
})

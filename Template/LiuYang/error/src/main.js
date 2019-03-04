// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ajax from './services/ajax'
import qs from 'qs'
import wx from 'weixin-js-sdk'
//import Vconsole from 'vconsole'
// import {WechatPlugin} from 'vux'
// Vue.use(WechatPlugin)
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.create({
  //baseURL:hostname,
  transformRequest: [function (data) {
    data = qs.stringify(data)
    return data
  }],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
Vue.prototype.$axios = axios
Vue.prototype.$wx = wx
Vue.prototype.$ajax = ajax
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

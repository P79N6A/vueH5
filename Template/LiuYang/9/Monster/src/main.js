// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuex from 'vuex'
import vueAwesomeSwiper from 'vue-awesome-swiper'
import axios from 'axios'
import ajax from './services/ajax'
//import './services/rem'
import './services/kinercode'
import qs from 'qs'
import wx from 'weixin-js-sdk'
import store from './store/'
import JsBarcode from 'jsbarcode'
//import Vconsole from 'vconsole'
// import {WechatPlugin} from 'vux'
// Vue.use(WechatPlugin)
Vue.use(vuex)
Vue.use(vueAwesomeSwiper)
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
Vue.prototype.$jsbarcode = JsBarcode
Vue.config.productionTip = false


//const vConsole = new Vconsole()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
